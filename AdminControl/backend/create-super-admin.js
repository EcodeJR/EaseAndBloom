const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createSuperAdmin = async () => {
  try {
    console.log('🔐 Creating Super Admin Account');
    console.log('================================\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to database');
    
    // Get admin details from user
    const name = await askQuestion('Enter admin name: ');
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password (min 8 characters): ');
    
    // Validate password length
    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      process.exit(1);
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists');
      process.exit(1);
    }
    
    // Create super admin
    const superAdmin = new Admin({
      name,
      email,
      password,
      role: 'super_admin',
      permissions: {
        canManageBlogs: true,
        canManageStories: true,
        canManageAdmins: true,
        canViewAnalytics: true
      },
      isActive: true
    });
    
    await superAdmin.save();
    
    console.log('\n✅ Super Admin created successfully!');
    console.log(`Name: ${superAdmin.name}`);
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Role: ${superAdmin.role}`);
    console.log('\nYou can now log in to the admin dashboard.');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Run if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    console.log('Please create a .env file with your MongoDB connection string');
    process.exit(1);
  }
  
  createSuperAdmin();
}

module.exports = createSuperAdmin;
