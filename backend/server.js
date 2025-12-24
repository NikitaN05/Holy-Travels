const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/travellers', require('./routes/travellers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join tour room
  socket.on('join_tour', (tourId) => {
    socket.join(`tour_${tourId}`);
    console.log(`User joined tour room: tour_${tourId}`);
  });

  // Join user room for personal notifications
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined personal room: user_${userId}`);
  });

  // Join chat room
  socket.on('join_chat', (conversationId) => {
    socket.join(`chat_${conversationId}`);
    console.log(`User joined chat room: chat_${conversationId}`);
  });

  // Leave chat room
  socket.on('leave_chat', (conversationId) => {
    socket.leave(`chat_${conversationId}`);
  });

  // Live chat typing indicator
  socket.on('typing', (data) => {
    socket.to(`chat_${data.conversationId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Emergency alert
  socket.on('emergency_alert', async (data) => {
    io.emit('emergency_broadcast', {
      travellerId: data.travellerId,
      location: data.location,
      timestamp: new Date(),
      message: 'EMERGENCY ALERT - Traveller needs help!'
    });
    console.log('🚨 Emergency Alert Triggered:', data);
  });

  // WhatsApp/Call request
  socket.on('contact_request', (data) => {
    io.emit('admin_contact_request', {
      type: data.type, // 'whatsapp', 'call', 'sms'
      phone: data.phone,
      name: data.name,
      message: data.message,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Daily menu notification cron job (runs at 7 AM, 12 PM, 7 PM)
cron.schedule('0 7,12,19 * * *', async () => {
  const Notification = require('./models/Notification');
  const Menu = require('./models/Menu');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const menu = await Menu.findOne({ date: today, isActive: true });
  if (menu) {
    const hour = new Date().getHours();
    let mealType = 'breakfast';
    if (hour >= 12 && hour < 17) mealType = 'lunch';
    else if (hour >= 17) mealType = 'dinner';
    
    io.emit('menu_notification', {
      type: mealType,
      menu: menu[mealType],
      timing: menu.timings[mealType]
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, io };
