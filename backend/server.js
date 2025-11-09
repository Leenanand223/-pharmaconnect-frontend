const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const chatRoutes = require('./routes/chat');
const prescriptionRoutes = require('./routes/prescriptions');
const userRoutes = require('./routes/users');
const videoRoutes = require('./routes/video');

const { initializeDatabase } = require('./database/init');
const { authenticateSocket } = require('./middleware/auth');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/video', videoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time features
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Join consultation room
  socket.on('join_consultation', (consultationId) => {
    socket.join(`consultation_${consultationId}`);
    socket.to(`consultation_${consultationId}`).emit('user_joined', {
      userId: socket.userId,
      userRole: socket.userRole
    });
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    const message = {
      id: Date.now(),
      senderId: socket.userId,
      senderRole: socket.userRole,
      message: data.message,
      timestamp: new Date().toISOString(),
      consultationId: data.consultationId
    };

    // Save message to database (implement in chat routes)
    socket.to(`consultation_${data.consultationId}`).emit('receive_message', message);
  });

  // Handle video call signaling
  socket.on('video_offer', (data) => {
    socket.to(`consultation_${data.consultationId}`).emit('video_offer', {
      offer: data.offer,
      from: socket.userId
    });
  });

  socket.on('video_answer', (data) => {
    socket.to(`consultation_${data.consultationId}`).emit('video_answer', {
      answer: data.answer,
      from: socket.userId
    });
  });

  socket.on('ice_candidate', (data) => {
    socket.to(`consultation_${data.consultationId}`).emit('ice_candidate', {
      candidate: data.candidate,
      from: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 PharmaConnect Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});