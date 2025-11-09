# 🚀 PharmaConnect Quick Start

## Current Status: ✅ READY TO USE

Your PharmaConnect application is **fully integrated** with both demo and production modes!

---

## 🎭 Demo Mode (Current - Default)

### What You Can Do RIGHT NOW:

```bash
# Just run the frontend
npm run dev
```

**No backend needed!** The app works with dummy data:

✅ **Login as any role:**
- Patient
- Pharmacist  
- Admin

✅ **See all features:**
- Book appointments
- View prescriptions
- Chat interface
- Video consultation UI
- Admin dashboard
- User profiles

✅ **Perfect for:**
- Presentations
- UI/UX demonstrations
- Stakeholder reviews
- Quick testing

---

## 🚀 Production Mode (Full Backend)

### To Enable Real Backend:

**Step 1: Start Backend (One Time Setup)**
```bash
cd backend
npm install
npm run init-db
npm run dev
```

**Step 2: Install Socket.IO**
```bash
# From project root
npm install socket.io-client
```

**Step 3: Switch Mode**

Open `src/config.js`:
```javascript
export const config = {
  mode: 'production', // Change from 'demo' to 'production'
  // ...
};
```

**Step 4: Restart Frontend**
```bash
npm run dev
```

### Test Accounts (Production Mode):
- **Patient**: `john@example.com` / `password123`
- **Pharmacist**: `sarah@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

---

## 🎯 Visual Indicators

### You'll See a Banner:

**Demo Mode:**
```
🎭 DEMO MODE - Using dummy data for demonstration
```

**Production Mode:**
```
✅ PRODUCTION MODE - Connected to backend API
```

### Plus a Toggle Button (Bottom Right):
- **Yellow/Orange** = Demo Mode
- **Green/Blue** = Production Mode
- Click for switching instructions

---

## 📋 Feature Comparison

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| Login | ✅ Role-based | ✅ Email/Password |
| Data Persistence | ❌ localStorage only | ✅ Database |
| Real-time Chat | ❌ Simulated | ✅ Socket.IO |
| File Upload | ❌ Simulated | ✅ Real files |
| Video Calls | ❌ UI only | ✅ WebRTC ready |
| Multi-user | ❌ Single session | ✅ Multiple users |

---

## 🎬 Recommended Workflow

### For Presentations:
1. ✅ Use **Demo Mode** (default)
2. ✅ No setup required
3. ✅ Show complete workflow
4. ✅ Fast and reliable

### For Development:
1. 🔄 Switch to **Production Mode**
2. 🔄 Test real API integration
3. 🔄 Verify database operations
4. 🔄 Test real-time features

---

## 🔍 How to Check Current Mode

### Method 1: Visual Banner
Look at the top of the page for the colored banner

### Method 2: Toggle Button
Check the button in bottom-right corner

### Method 3: Code
```javascript
import { isDemoMode } from './config';
console.log('Demo mode:', isDemoMode());
```

---

## 💡 Pro Tips

1. **Start with demo mode** - It's already configured and working
2. **Switch to production** only when you need real data
3. **Keep dummy data** - It's useful for testing UI without backend
4. **Use the toggle button** - Quick way to see current mode
5. **Check the banner** - Always visible indicator

---

## 🎉 You're All Set!

Your PharmaConnect app is ready to use in **both modes**:

- 🎭 **Demo Mode**: Perfect for showing off the system
- 🚀 **Production Mode**: Ready for real-world usage

Just run `npm run dev` and start exploring!

---

## 📚 Need More Info?

- **Full Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Backend Setup**: See `backend/README.md`
- **API Documentation**: See `SETUP.md`

---

## ❓ Quick Troubleshooting

**Q: Can I use both modes?**  
A: Yes! Switch anytime by changing `src/config.js`

**Q: Will I lose data when switching?**  
A: Demo mode uses localStorage, Production uses database. They're separate.

**Q: Do I need the backend for demo mode?**  
A: No! Demo mode works standalone.

**Q: How do I know which mode I'm in?**  
A: Check the colored banner at the top or the toggle button.

---

**Happy Coding! 🎉**
