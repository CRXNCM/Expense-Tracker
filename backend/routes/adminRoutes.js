const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const User = require('../models/User');

const router = express.Router();

// Debug endpoint to check current user role
router.get('/debug-role', protect, async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            roleType: typeof req.user.role
        }
    });
});

// Get all users (only super admin)
router.get('/users', protect, requireRole('superadmin'), async (req, res) => {
    const users = await User.find().select('-password');
    console.log('User role:', req.user.role);  // debug here
    res.json({ success: true, users });
});

// Update user role
router.put('/users/:id/role', protect, requireRole('superadmin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role provided' 
            });
        }

        const user = await User.findByIdAndUpdate(
            id, 
            { role }, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'User role updated successfully', 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Delete user
router.delete('/users/:id', protect, requireRole('superadmin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting yourself
        if (id === req.user._id.toString()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete your own account' 
            });
        }

        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;
