import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('👋 Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Set up default listeners
    this.setupDefaultListeners();
  }

  setupDefaultListeners() {
    // Emergency alerts
    this.socket.on('emergency_alert', (data) => {
      console.log('🚨 Emergency Alert:', data);
      this.notifyListeners('emergency_alert', data);
    });

    this.socket.on('emergency_acknowledged', (data) => {
      this.notifyListeners('emergency_acknowledged', data);
    });

    this.socket.on('emergency_resolved', (data) => {
      this.notifyListeners('emergency_resolved', data);
    });

    // Notifications
    this.socket.on('new_notification', (data) => {
      console.log('🔔 New notification:', data);
      this.notifyListeners('new_notification', data);
    });

    // Menu updates
    this.socket.on('menu_updated', (data) => {
      this.notifyListeners('menu_updated', data);
    });

    this.socket.on('menu_notification', (data) => {
      this.notifyListeners('menu_notification', data);
    });

    // Booking updates
    this.socket.on('booking_confirmed', (data) => {
      this.notifyListeners('booking_confirmed', data);
    });

    this.socket.on('ticket_updated', (data) => {
      this.notifyListeners('ticket_updated', data);
    });

    // Poll updates
    this.socket.on('new_poll', (data) => {
      this.notifyListeners('new_poll', data);
    });

    this.socket.on('poll_ended', (data) => {
      this.notifyListeners('poll_ended', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a specific tour room
  joinTour(tourId) {
    if (this.socket?.connected) {
      this.socket.emit('join_tour', tourId);
    }
  }

  // Join user-specific room
  joinUser(userId) {
    if (this.socket?.connected) {
      this.socket.emit('join_user', userId);
    }
  }

  // Trigger emergency
  triggerEmergency(data) {
    if (this.socket?.connected) {
      this.socket.emit('emergency_alert', data);
    }
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  // Custom emit
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;

