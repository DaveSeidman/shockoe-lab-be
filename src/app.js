require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // To create a server for Socket.IO
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors'); // Require the CORS module

const Theme = require('./models/Theme'); // Import the Theme model

// Routes
const userRoutes = require('./routes/User');
const entryRoutes = require('./routes/Entry');
const typeRoutes = require('./routes/Type');
const tagRoutes = require('./routes/Tag');
const themeRoutes = require('./routes/Theme');
const dataRoutes = require('./routes/Data');
const s3Routes = require('./routes/S3');

// Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON

// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://daveseidman.github.io'],
  methods: ['GET', 'POST'],
}));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080', 'https://daveseidman.github.io'],
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/s3', s3Routes);

app.get('/', (req, res) => {
  res.send('shokoe lab api');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Example: Emit a welcome message to the connected client
  socket.emit('message', 'Welcome to the Socket.IO server!');

  // Handle client events (if any)
  socket.on('clientMessage', (msg) => {
    console.log('Message from client:', msg);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, () => console.log('Server running'));
