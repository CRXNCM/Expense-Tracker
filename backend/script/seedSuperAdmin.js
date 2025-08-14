const createSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'superadmin@sys.com' });
    if (existing) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const superadmin = new User({
      fullname: 'Super Admin',
      email: 'superadmin@sys.com',
      password: 'yourStrongPassword',
      role: 'superadmin',
      isVerified: true,
    });

    await superadmin.save();
    console.log('🚀 Super admin created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
};
