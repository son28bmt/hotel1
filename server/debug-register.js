const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Enable mongoose debugging
mongoose.set('debug', true);

// Get MongoDB connection string from .env
const mongoURL = process.env.MONGO_URL;
console.log('Attempting to connect to MongoDB with URL:', mongoURL);

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✓ MongoDB connected successfully!');
  
  try {
    // Mock registration data
    const userData = {
      name: 'Debug User',
      username: 'debuguser',
      email: 'debug@example.com',
      password: 'password123',
      dob: new Date('1990-01-01')
    };
    
    console.log('1. Checking if user already exists...');
    let existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('User already exists, deleting for fresh test...');
      await User.deleteOne({ email: userData.email });
      console.log('Existing user deleted.');
    }
    
    console.log('2. Hashing password...');
    let passHash = await bcrypt.hash(userData.password, 12);
    console.log('Password hashed successfully');
    
    console.log('3. Generating tokens...');
    const accessToken = await jwt.sign({ email: userData.email }, 'accessToken', {
      expiresIn: '4h'
    });
    const refreshToken = await jwt.sign({ email: userData.email }, 'refreshToken', {
      expiresIn: '7d'
    });
    console.log('Tokens generated successfully');
    
    console.log('4. Creating new user object...');
    let user = new User({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      password: passHash,
      dob: userData.dob,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExp: '4h',
      refreshTokenExp: '7d'
    });
    
    console.log('5. Attempting to save user...');
    console.log('User object to save:', user);
    
    let savedUser = await user.save();
    console.log('6. User saved successfully!');
    console.log('Saved user details:', savedUser);
    
    // Verify user was saved by fetching it again
    console.log('7. Verifying user was saved...');
    let fetchedUser = await User.findOne({ email: userData.email });
    if (fetchedUser) {
      console.log('User verification successful! Found in database.');
    } else {
      console.log('WARNING: User not found in database after save!');
    }
    
    // Check how many users are in the collection
    const userCount = await User.countDocuments();
    console.log(`8. Total users in database: ${userCount}`);
    
  } catch (error) {
    console.error('ERROR during registration process:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Connection closed.');
  }
})
.catch(err => {
  console.error('✗ MongoDB connection failed with error:', err);
});
