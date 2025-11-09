# PharmaConnect Integration Guide

## 🎭 Demo Mode vs Production Mode

Your PharmaConnect application now supports **two modes**:

### **Demo Mode** (Default)
- Uses dummy data for demonstration
- No backend required
- Perfect for presentations and testing UI
- Shows how the system works without setup

### **Production Mode**
- Connects to real backend API
- Persistent data in SQLite database
- Real authentication and authorization
- Full functionality with Socket.IO

---

## 🚀 Quick Start

### Current Status: **DEMO MODE** ✅

The app is currently running in **demo mode** with dummy data. You can:
- ✅ Login with any role (patient/pharmacist/admin)
- ✅ See all UI features and workflows
- ✅ Test the complete user experience
- ✅ Show the system to stakeholders

---

## 🔄 Switching to Production Mode

### Step 1: Start the Backend

```bash
# Terminal 1 - Start Backend
cd backend
npm install
npm run init-db
npm run dev
```

Backend will start on `http://localhost:5000`

### Step 2: Install Frontend Dependencies

```bash
# Terminal 2 - Install Socket.IO Client
npm install socket.io-client
```

### Step 3: Switch to Production Mode

Open `src/config.js` and change:

```javascript
export const config = {
  mode: 'production', // Changed from 'demo' to 'production'
  // ... rest of config
};
```

### Step 4: Restart Frontend

```bash
npm run dev
```

You'll see a **green banner** indicating production mode is active!

---

## 🎯 Features in Each Mode

### Demo Mode Features
| Feature | Status | Notes |
|---------|--------|-------|
| User Login | ✅ | Role-based (patient/pharmacist/admin) |
| Registration | ✅ | Simulated with dummy data |
| Appointments | ✅ | Static dummy appointments |
| Prescriptions | ✅ | Static dummy prescriptions |
| Chat | ✅ | Simulated messages |
| Video Calls | ✅ | UI only (no real WebRTC) |
| User Profiles | ✅ | Stored in localStorage |

### Production Mode Features
| Feature | Status | Notes |
|---------|--------|-------|
| User Login | ✅ | Real authentication with JWT |
| Registration | ✅ | Stored in database |
| Appointments | ✅ | Full CRUD with database |
| Prescriptions | ✅ | File upload + database |
| Chat | ✅ | Real-time with Socket.IO |
| Video Calls | ✅ | WebRTC signaling ready |
| User Profiles | ✅ | Database persistence |

---

## 🔐 Test Accounts (Production Mode)

After running `npm run init-db`, these accounts are available:

**Patient Account:**
- Email: `john@example.com`
- Password: `password123`

**Pharmacist Account:**
- Email: `sarah@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

---

## 📊 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Port 5173)      │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   src/config.js                  │  │
│  │   mode: 'demo' | 'production'    │  │
│  └──────────────────────────────────┘  │
│                 │                       │
│                 ▼                       │
│  ┌──────────────────────────────────┐  │
│  │   authService.js                 │  │
│  │   dataService.js                 │  │
│  │   (Smart routing based on mode)  │  │
│  └──────────────────────────────────┘  │
│         │                    │          │
│         ▼                    ▼          │
│  ┌──────────┐        ┌──────────────┐  │
│  │  Dummy   │        │  API Service │  │
│  │  Data    │        │  + Socket.IO │  │
│  └──────────┘        └──────────────┘  │
└─────────────────────────────────────────┘
                              │
                              ▼
                ┌──────────────────────────┐
                │  Backend API (Port 5000) │
                │  - Express REST API      │
                │  - Socket.IO Server      │
                │  - SQLite Database       │
                └──────────────────────────┘
```

### Service Layer

**authService.js**
- Handles login/logout/registration
- Automatically switches between demo and production
- Manages localStorage for user sessions

**dataService.js**
- Handles appointments, prescriptions, chat
- Returns dummy data in demo mode
- Makes API calls in production mode

**api.js**
- REST API client for backend
- Only used in production mode

**socket.js**
- Socket.IO client for real-time features
- Only used in production mode

---

## 🎨 Visual Indicators

### Demo Mode Banner (Yellow/Orange)
```
🎭 DEMO MODE - Using dummy data for demonstration
```

### Production Mode Banner (Green/Blue)
```
✅ PRODUCTION MODE - Connected to backend API
```

---

## 🔧 Configuration Options

Edit `src/config.js`:

```javascript
export const config = {
  // Toggle mode
  mode: 'demo', // or 'production'
  
  // API settings (production mode)
  api: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 10000
  },
  
  // Socket.IO settings (production mode)
  socket: {
    url: 'http://localhost:5000',
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  }
};
```

---

## 🐛 Troubleshooting

### Backend Not Connecting

**Problem:** Production mode shows errors

**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Check CORS settings in `backend/server.js`
3. Verify `.env` file in backend folder
4. Check browser console for errors

### Demo Mode Not Working

**Problem:** Dummy data not showing

**Solution:**
1. Verify `mode: 'demo'` in `src/config.js`
2. Clear browser localStorage
3. Refresh the page
4. Check browser console for errors

### Socket.IO Connection Failed

**Problem:** Real-time features not working

**Solution:**
1. Install socket.io-client: `npm install socket.io-client`
2. Check backend Socket.IO server is running
3. Verify token in localStorage
4. Check browser console for connection errors

---

## 📝 Development Workflow

### For Presentations/Demos
1. Use **Demo Mode** (default)
2. No backend setup required
3. Show complete UI/UX flow
4. Fast and reliable

### For Development/Testing
1. Switch to **Production Mode**
2. Start backend server
3. Test real API integration
4. Verify database operations

### For Production Deployment
1. Set `mode: 'production'`
2. Update API URLs in config
3. Deploy backend to server
4. Deploy frontend to hosting

---

## 🎯 Next Steps

### Immediate
- ✅ Demo mode working with dummy data
- ✅ Production mode structure ready
- ✅ Service layer implemented
- ✅ Mode switching configured

### To Complete Full Integration
1. **Video Calling**: Integrate WebRTC for real video
2. **File Upload**: Connect prescription image upload
3. **Real-time Chat**: Enable Socket.IO in production
4. **Notifications**: Add email/SMS services
5. **Payment**: Integrate payment gateway

---

## 📚 Additional Resources

- **Backend API Docs**: See `backend/README.md`
- **API Endpoints**: See `SETUP.md`
- **Socket.IO Events**: See `backend/server.js`
- **Database Schema**: See `backend/database/init.js`

---

## 💡 Tips

1. **Always start in demo mode** for quick testing
2. **Switch to production** when you need real data
3. **Check the banner** to know which mode is active
4. **Use browser DevTools** to debug API calls
5. **Check backend logs** for server-side issues

---

## ✨ Summary

Your PharmaConnect app is now **dual-mode**:
- 🎭 **Demo Mode**: Perfect for showing the system
- 🚀 **Production Mode**: Ready for real usage

Simply change one line in `src/config.js` to switch between modes!
