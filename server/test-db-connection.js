const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get MongoDB connection string from .env
const mongoURL = process.env.MONGO_URL;
console.log('Attempting to connect to MongoDB with URL:', mongoURL);

// Attempt to connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✓ MongoDB connected successfully!');
  // Close the connection after successful test
  mongoose.connection.close();
  console.log('Connection closed.');
})
.catch(err => {
  console.error('✗ MongoDB connection failed with error:', err);
});

// Additional connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('Connection error event:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connection open event fired!');
});
