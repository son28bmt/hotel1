const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get MongoDB connection string from .env
const mongoURL = process.env.MONGO_URL;
console.log('Attempting to connect to MongoDB with URL:', mongoURL);

// Define a simple User schema for testing
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✓ MongoDB connected successfully!');
  
  try {
    // Enable mongoose debug mode to see detailed query logs
    mongoose.set('debug', true);
    
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      dob: new Date('1990-01-01')
    });
    
    // Save the test user to the database
    console.log('Attempting to save test user...');
    const savedUser = await testUser.save();
    console.log('User saved successfully:', savedUser._id);
    
    // Find the user we just created to verify it was saved
    const foundUser = await User.findOne({ email: 'test@example.com' });
    if (foundUser) {
      console.log('Successfully retrieved saved user from database!');
    } else {
      console.log('Failed to retrieve user - it may not have been saved properly.');
    }
  } catch (error) {
    console.error('Error during database operations:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Connection closed.');
  }
})
.catch(err => {
  console.error('✗ MongoDB connection failed with error:', err);
});
