const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
exports.registerUser = async (req, res) => {
    try {
      console.log('Registration request received');
      console.log('Request body:', req.body);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Request headers:', req.headers);
  
      let { fullname, email, password, confirmPassword, username } = req.body;
      let profileImageUrl = null;
  
      if (req.file) {
        profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
  
      if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: fullname, email, password, confirmPassword',
        });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
        });
      }
  
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }
  
      email = email.trim().toLowerCase();
      if (username) {
        username = username.trim().toLowerCase();
      }
  
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }
  
      if (username) {
        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
          return res.status(400).json({
            success: false,
            message: 'Username is already taken',
          });
        }
      }
  
      const user = new User({
        fullname: fullname.trim(),
        email,
        username: username || null,
        password,
        profileImageUrl,
      });
  
      await user.save();
  
      const token = generateToken(user._id);
  
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: user.getPublicProfile(),
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  };
  
// Login user
exports.loginUser = async (req, res) => {
    try {
      const { login, password } = req.body;
  
      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username/email and password',
        });
      }
  
      const user = await User.findOne({
        $or: [
          { email: login.toLowerCase() },
          { username: login.toLowerCase() }
        ]
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      await user.updateLastLogin();
  
      const token = generateToken(user._id);
  
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: user.getPublicProfile(),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  };
  
// Get user info (protected route)
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user: user.getPublicProfile ? user.getPublicProfile() : user
        });
    } catch (err) {
        console.error('Get user info error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullname, profileImageUrl } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (fullname) user.fullname = fullname;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                ...user.getPublicProfile(),
                userId: user._id
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during profile update' 
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during password change' 
        });
    }
};
