# PharmaConnect Setup Guide

Complete setup instructions for the PharmaConnect video consultation system.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Install Frontend Dependencies

```bash
# Install React frontend dependencies
npm install

# Install Socket.IO client for real-time features
npm install socket.io-client
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Initialize database with sample data
npm run init-db
```

### 3. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
# From project root
npm run dev
```
Frontend will start on `http://localhost:5173`

## Default Test Accounts

After running `npm run init-db`, these accounts are available:

- **Patient Account**
  - Email: `john@example.com`
  - Password: `password123`

- **Pharmacist Account**
  - Email: `sarah@example.com`
  - Password: `password123`

- **Admin Account**
  - Email: `admin@example.com`
  - Password: `password123`

## Features Available

### ✅ Implemented Backend Features

1. **User Authentication**
   - Registration and login
   - JWT token-based authentication
   - Role-based access control

2. **Appointment System**
   - Book appointments with pharmacists
   - View appointment history
   - Real-time availability checking

3. **Video Consultation**
   - WebRTC session management
   - Room creation and joining
   - Session status tracking

4. **Real-time Chat**
   - Socket.IO powered messaging
   - Chat history persistence
   - Real-time message delivery

5. **Prescription Management**
   - Upload prescription images
   - Pharmacist review system
   - Prescription history

6. **Admin Dashboard**
   - User management
   - System statistics
   - Role management

### 🔄 Integration Required

To fully connect the frontend with the backend, you need to:

1. **Replace dummy data calls** in your React components with API calls
2. **Add authentication state management** using the API service
3. **Implement real-time features** using the Socket.IO service
4. **Add video calling functionality** using WebRTC

## Quick Integration Example

### Replace Login Function

**Current (dummy):**
```javascript
const login = (role) => {
  setCurrentUser(dummyData.users[role]);
  navigate('home');
};
```

**With Backend:**
```javascript
import apiService from './services/api';

const login = async (email, password) => {
  try {
    const response = await apiService.login(email, password);
    setCurrentUser(response.user);
    navigate('home');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## API Endpoints

The backend provides these main endpoints:

- **Authentication**: `/api/auth/*`
- **Appointments**: `/api/appointments/*`
- **Video Sessions**: `/api/video/*`
- **Chat**: `/api/chat/*`
- **Prescriptions**: `/api/prescriptions/*`
- **Users**: `/api/users/*`

## Real-time Features

Socket.IO events for real-time functionality:

- `join_consultation` - Join video consultation room
- `send_message` - Send chat message
- `video_offer/answer` - WebRTC signaling
- `receive_message` - Receive chat messages

## File Upload

Prescription images can be uploaded to `/api/prescriptions/request` with:
- Maximum file size: 5MB
- Supported formats: JPEG, JPG, PNG, PDF
- Secure file access control

## Database

SQLite database with tables:
- `users` - User accounts and profiles
- `appointments` - Consultation bookings
- `video_sessions` - WebRTC session management
- `chat_messages` - Real-time messaging
- `prescriptions` - Prescription management

## Security Features

- JWT authentication with expiration
- Role-based authorization
- Rate limiting (100 requests per 15 minutes)
- File upload validation
- CORS protection
- Helmet security headers

## Development Workflow

1. **Backend Development**: Modify routes in `backend/routes/`
2. **Frontend Integration**: Use `src/services/api.js` for API calls
3. **Real-time Features**: Use `src/services/socket.js` for Socket.IO
4. **Database Changes**: Update `backend/database/init.js`

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Update API base URL for production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration in `server.js`
2. **Authentication Failures**: Verify JWT token in localStorage
3. **Socket Connection Issues**: Check token in Socket.IO auth
4. **File Upload Errors**: Verify file size and format restrictions

### Health Check

Backend health check: `GET http://localhost:5000/api/health`

### Logs

Backend logs show:
- Database connections
- API requests
- Socket.IO connections
- Error messages

## Next Steps

1. **Integrate Authentication**: Replace dummy login with real API calls
2. **Add Video Calling**: Implement WebRTC using the video session API
3. **Real-time Chat**: Connect Socket.IO service to chat components
4. **File Upload**: Add prescription image upload functionality
5. **Error Handling**: Add proper error handling and loading states

Your PharmaConnect system now has a complete backend infrastructure ready for integration!