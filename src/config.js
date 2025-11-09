// Configuration for PharmaConnect

export const config = {
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000
  },
  
  // Socket.IO configuration
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  }
};
