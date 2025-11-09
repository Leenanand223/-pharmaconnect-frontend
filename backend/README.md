# PharmaConnect Backend

Backend API for the PharmaConnect video consultation system connecting patients with pharmacists.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Video Consultation System**: WebRTC signaling and session management
- **Real-time Chat**: Socket.IO powered messaging during consultations
- **Appointment Management**: Booking, scheduling, and status tracking
- **Prescription Management**: Upload, review, and manage prescriptions
- **File Upload**: Secure prescription image handling
- **User Management**: Admin dashboard functionality

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `GET /api/appointments/pharmacists` - Get available pharmacists
- `GET /api/appointments/pharmacists/:id/availability` - Get pharmacist availability

### Video Consultation
- `POST /api/video/session` - Create video session
- `POST /api/video/session/:roomId/join` - Join video session
- `POST /api/video/session/:roomId/end` - End video session
- `GET /api/video/session/:roomId` - Get session info

### Chat
- `GET /api/chat/appointment/:appointmentId` - Get chat messages
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/conversations` - Get user conversations

### Prescriptions
- `GET /api/prescriptions` - Get user prescriptions
- `POST /api/prescriptions/request` - Create prescription request
- `PUT /api/prescriptions/:id` - Update prescription (pharmacist)
- `GET /api/prescriptions/:id/image` - Get prescription image
- `DELETE /api/prescriptions/:id` - Delete prescription

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

## Default Users

After running `npm run init-db`, these test accounts are available:

- **Patient**: `john@example.com` / `password123`
- **Pharmacist**: `sarah@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## Socket.IO Events

### Client to Server
- `join_consultation` - Join consultation room
- `send_message` - Send chat message
- `video_offer` - WebRTC offer
- `video_answer` - WebRTC answer
- `ice_candidate` - ICE candidate

### Server to Client
- `user_joined` - User joined consultation
- `receive_message` - New chat message
- `video_offer` - WebRTC offer received
- `video_answer` - WebRTC answer received
- `ice_candidate` - ICE candidate received

## Database Schema

### Users
- Authentication and profile information
- Role-based access (patient, pharmacist, admin)

### Appointments
- Consultation scheduling and management
- Links patients with pharmacists

### Video Sessions
- WebRTC session management
- Room creation and status tracking

### Chat Messages
- Real-time messaging during consultations
- Message history and persistence

### Prescriptions
- Prescription requests and management
- File upload support for prescription images

## Security Features

- JWT authentication with expiration
- Role-based authorization
- Rate limiting
- Helmet security headers
- File upload validation
- SQL injection prevention
- CORS configuration

## File Upload

Prescription images are stored in the `uploads/` directory with:
- 5MB file size limit
- Allowed formats: JPEG, JPG, PNG, PDF
- Unique filename generation
- Secure file access control

## Development

### Project Structure
```
backend/
├── routes/          # API route handlers
├── middleware/      # Authentication & validation
├── database/        # Database initialization
├── scripts/         # Utility scripts
├── uploads/         # File upload directory
└── server.js        # Main server file
```

### Adding New Features
1. Create route handler in `routes/`
2. Add middleware if needed
3. Update database schema in `database/init.js`
4. Test with frontend integration

## Production Deployment

1. Set production environment variables
2. Use process manager (PM2)
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates
5. Set up database backups
6. Monitor logs and performance

## Health Check

The server provides a health check endpoint:
```
GET /api/health
```

Returns server status and timestamp for monitoring.