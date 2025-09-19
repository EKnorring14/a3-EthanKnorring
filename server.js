const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/redsox_stats';
const dbName = 'redsox_stats';
let db;

// Connect to MongoDB
MongoClient.connect(uri)
.then(client => {
  console.log('Connected to MongoDB');
  db = client.db(dbName);
})
.catch(error => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: uri,
    dbName: dbName
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

// Routes

// Home route - redirect to login if not authenticated
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Login page
app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Dashboard page (protected)
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Login POST route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({ username });
    
    if (!user) {
      // Create new user account
      const newUser = {
        username,
        password, // In production, you should hash passwords!
        createdAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newUser);
      user = { _id: result.insertedId, username };
      
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      
      res.json({ 
        success: true, 
        message: 'New account created successfully! You are now logged in.',
        redirect: '/dashboard'
      });
    } else if (user.password === password) {
      // Successful login
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      
      res.json({ 
        success: true, 
        message: 'Login successful!',
        redirect: '/dashboard'
      });
    } else {
      // Wrong password
      res.json({ 
        success: false, 
        message: 'Incorrect password. Please try again.'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login'
    });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ success: false, message: 'Logout failed' });
    } else {
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
});

// Get current user info
app.get('/user', requireAuth, (req, res) => {
  res.json({ 
    username: req.session.username,
    userId: req.session.userId
  });
});

// Get players for logged-in user
app.get('/players', requireAuth, async (req, res) => {
  try {
    const playersCollection = db.collection('players');
    const players = await playersCollection
      .find({ userId: req.session.userId })
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Add new player
app.post('/players', requireAuth, async (req, res) => {
  try {
    const { name, position, avg, obp, slg } = req.body;
    
    const newPlayer = {
      userId: req.session.userId,
      name,
      position,
      avg: parseFloat(avg),
      obp: parseFloat(obp),
      slg: parseFloat(slg),
      ops: parseFloat((parseFloat(obp) + parseFloat(slg)).toFixed(3)),
      createdAt: new Date()
    };
    
    const playersCollection = db.collection('players');
    const result = await playersCollection.insertOne(newPlayer);
    
    // Return all players for this user
    const players = await playersCollection
      .find({ userId: req.session.userId })
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
});

// Update player
app.put('/players/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, avg, obp, slg } = req.body;
    
    const updatedPlayer = {
      name,
      position,
      avg: parseFloat(avg),
      obp: parseFloat(obp),
      slg: parseFloat(slg),
      ops: parseFloat((parseFloat(obp) + parseFloat(slg)).toFixed(3)),
      updatedAt: new Date()
    };
    
    const playersCollection = db.collection('players');
    await playersCollection.updateOne(
      { _id: new ObjectId(id), userId: req.session.userId },
      { $set: updatedPlayer }
    );
    
    // Return all players for this user
    const players = await playersCollection
      .find({ userId: req.session.userId })
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// Delete player
app.delete('/players/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const playersCollection = db.collection('players');
    await playersCollection.deleteOne({
      _id: new ObjectId(id),
      userId: req.session.userId
    });
    
    // Return all players for this user
    const players = await playersCollection
      .find({ userId: req.session.userId })
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});