// Socket.IO service for real-time features

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Consultation room methods
  joinConsultation(consultationId) {
    if (this.socket) {
      this.socket.emit('join_consultation', consultationId);
    }
  }

  // Chat methods
  sendMessage(consultationId, message) {
    if (this.socket) {
      this.socket.emit('send_message', {
        consultationId,
        message
      });
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  // Video call signaling methods
  sendVideoOffer(consultationId, offer) {
    if (this.socket) {
      this.socket.emit('video_offer', {
        consultationId,
        offer
      });
    }
  }

  sendVideoAnswer(consultationId, answer) {
    if (this.socket) {
      this.socket.emit('video_answer', {
        consultationId,
        answer
      });
    }
  }

  sendIceCandidate(consultationId, candidate) {
    if (this.socket) {
      this.socket.emit('ice_candidate', {
        consultationId,
        candidate
      });
    }
  }

  onVideoOffer(callback) {
    if (this.socket) {
      this.socket.on('video_offer', callback);
    }
  }

  onVideoAnswer(callback) {
    if (this.socket) {
      this.socket.on('video_answer', callback);
    }
  }

  onIceCandidate(callback) {
    if (this.socket) {
      this.socket.on('ice_candidate', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  // Remove event listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;