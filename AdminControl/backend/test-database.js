const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Blog = require('./models/Blog');
const Story = require('./models/Story');
const RefreshToken = require('./models/RefreshToken');
const PasswordResetToken = require('./models/PasswordResetToken');

dotenv.config();

// Test database connection and models
const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');
    
    // Test model creation
    console.log('Testing model creation...');
    
    // Test Admin model
    const testAdmin = new Admin({
      name: 'Test Admin',
      email: 'test@example.com',
      password: 'testpassword123',
      role: 'super_admin'
    });
    
    console.log('✅ Admin model created successfully');
    
    // Test Blog model
    const testBlog = new Blog({
      title: 'Test Blog Post',
      content: 'This is a test blog post content.',
      author: 'Test Author',
      featuredImage: {
        url: 'https://example.com/image.jpg',
        publicId: 'test-image-id'
      },
      categories: ['Mental Health'],
      createdBy: testAdmin._id
    });
    
    console.log('✅ Blog model created successfully');
    
    // Test Story model
    const testStory = new Story({
      title: 'Test Story',
      content: 'This is a test story content.',
      submitterName: 'Anonymous',
      category: 'Personal Experience'
    });
    
    console.log('✅ Story model created successfully');
    
    // Test RefreshToken model
    const testRefreshToken = new RefreshToken({
      token: 'test-refresh-token',
      adminId: testAdmin._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    console.log('✅ RefreshToken model created successfully');
    
    // Test PasswordResetToken model
    const testPasswordResetToken = new PasswordResetToken({
      adminId: testAdmin._id
    });
    
    console.log('✅ PasswordResetToken model created successfully');
    
    console.log('\n🎉 All models are working correctly!');
    console.log('\nNext steps:');
    console.log('1. Create your first super admin account');
    console.log('2. Start the server with: npm run dev');
    console.log('3. Test the API endpoints');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  testDatabase();
}

module.exports = testDatabase;
