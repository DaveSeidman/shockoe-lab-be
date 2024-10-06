require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // To create a server for Socket.IO
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
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

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development
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

const port = new SerialPort({
  path: process.env.RFID_READER,
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', async (data) => {
  console.log('RFID Data:', data);
  try {
    const theme = await Theme.findOne({ rfid: data.trim() }); // Trim the data to remove extra spaces or newline characters
    if (theme) {
      console.log(`Theme found: ${theme._id}`);
      io.emit('themeId', { theme: theme._id });
    } else {
      console.log('No theme found for RFID:', data);
      io.emit('themeId', { theme: null }); // Emit null if no theme is found
    }
  } catch (err) {
    console.error('Error looking up theme:', err);
    io.emit('error', 'Error looking up theme');
  }
});

port.on('open', () => {
  console.log('Serial Port Opened');
});

port.on('error', (err) => {
  console.error('Error: ', err.message);
});

server.listen(process.env.PORT, () => console.log('Server running'));
