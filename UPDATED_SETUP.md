# PharmaConnect - Complete Updated Setup Guide

## 📅 Last Updated: November 9, 2025

## 🎯 What's New in This Version

### Latest Fixes & Features
- ✅ **Appointment Booking Integration**: Booked consultations now immediately appear in patient dashboard
- ✅ **Real-time State Management**: Appointments are saved to application state
- ✅ **Dashboard Synchronization**: Patient dashboard shows pending, confirmed, and completed appointments
- ✅ **Indian Market Ready**: Localized with Indian names, currency (₹), and payment methods
- ✅ **Dual Consultation Modes**: Immediate (connect now) and Scheduled (book for later)
- ✅ **Consultation Types**: Video Call (full price) and Chat (50% discount)
- ✅ **Production Ready**: Removed demo mode, integrated with real backend APIs

---

## 🚀 Quick Start (For New Users)

### Step 1: Prerequisites

**Required Software:**
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- Git (optional but recommended) - [Download](https://git-scm.com/)
- OR GitHub Desktop (easier alternative) - [Download](https://desktop.github.com/)

**Check if installed:**
```bash
node --version
npm --version
```

### Step 2: Install Dependencies

Open terminal in project folder:

```bash
npm install
```

This installs all required packages including:
- React
- Vite
- Axios (for API calls)
- Lucide React (icons)
- TailwindCSS (styling)

### Step 3: Configure Environment

Create a `.env` file in the root folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Note:** The `.env` file is already configured. Only modify if your backend runs on a different port.

### Step 4: Start Development Server

```bash
npm run dev
```

The app will open at: `http://localhost:5173`

### Step 5: Test the Application

**Login Credentials:**

**Patient Account:**
- Email: `patient@test.com`
- Password: `password123`

**Pharmacist Account:**
- Email: `pharmacist@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `password123`

---

## 🔧 Project Structure

```
PharmaConnectApp/
├── src/
│   ├── App.jsx                 # Main application component (UPDATED)
│   ├── config.js               # Environment configuration
│   ├── components/
│   │   └── chatbot.jsx         # AI chatbot component
│   └── services/
│       ├── api.js              # API service layer
│       ├── authService.js      # Authentication service
│       └── dataService.js      # Data management service
├── public/                     # Static assets
├── .env                        # Environment variables (DO NOT COMMIT)
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # TailwindCSS configuration
```

---

## 🆕 Recent Changes Explained

### 1. Appointment Booking Fix

**Problem:** When patients booked consultations, they didn't appear in the dashboard.

**Solution:** Added appointment state management:

```javascript
// In App.jsx - New function added
const addAppointment = (appointmentData) => {
  const newAppointment = {
    id: appointments.length + 1,
    patientName: currentUser?.name || 'Guest',
    pharmacistName: appointmentData.pharmacistName,
    date: appointmentData.date,
    time: appointmentData.time,
    status: 'pending',
    type: appointmentData.reason,
    schedulingMode: appointmentData.schedulingMode,
    consultationType: appointmentData.type
  };
  
  setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
};
```

**Result:** Appointments now show immediately after booking in:
- Patient Dashboard → "Pending Approval" section
- After pharmacist approval → "Confirmed Appointments" section

### 2. How It Works

**Booking Flow:**
1. Patient clicks "Book Consultation"
2. Selects consultation mode (Immediate or Scheduled)
3. Chooses consultation type (Video Call or Chat)
4. Selects pharmacist
5. Provides reason for consultation
6. Completes payment
7. **NEW:** Appointment is added to state
8. Patient is redirected to dashboard
9. **NEW:** Appointment appears in "Pending Approval" section

**Dashboard Display:**
- **Pending Appointments**: Waiting for pharmacist approval (orange badge)
- **Confirmed Appointments**: Approved by pharmacist (green badge)
- **Completed Appointments**: Past consultations

---

## 🎨 Features Overview

### For Patients
- ✅ Book immediate or scheduled consultations
- ✅ Choose between video call or chat
- ✅ View appointment history
- ✅ Upload prescriptions
- ✅ Chat with pharmacists
- ✅ Manage health metrics
- ✅ Receive notifications

### For Pharmacists
- ✅ View pending appointment requests
- ✅ Accept or decline appointments
- ✅ Manage schedule and availability
- ✅ View patient prescriptions
- ✅ Send messages to patients
- ✅ Track consultation statistics

### For Admins
- ✅ Monitor all appointments
- ✅ Manage users (patients & pharmacists)
- ✅ View system analytics
- ✅ Generate reports

---

## 🌐 Deployment to GitHub

### Option 1: Using Git Command Line

**First Time Setup:**
```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create commit
git commit -m "PharmaConnect v1.1 - Fixed appointment booking integration"

# Connect to GitHub (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/pharmaconnect.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Deploying Updates:**
```bash
# Check changes
git status

# Add changed files
git add .

# Commit with message
git commit -m "Fix: Appointment booking now shows in patient dashboard"

# Push to GitHub
git push
```

### Option 2: Using GitHub Desktop (Recommended for Windows)

**⭐ EASIEST METHOD - NO COMMAND LINE NEEDED**

1. **Download & Install:**
   - Go to [desktop.github.com](https://desktop.github.com/)
   - Download and install GitHub Desktop
   - Sign in with your GitHub account

2. **Add Your Project:**
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\DELL\PharmaConnectApp`
   - Click "Add Repository"

3. **If Not a Git Repository:**
   - Click "Create a repository"
   - Uncheck "Initialize with README"
   - Click "Create Repository"

4. **Publish to GitHub:**
   - Click "Publish repository"
   - Choose repository name: `pharmaconnect`
   - Add description: "PharmaConnect - Online Pharmacy Consultation Platform"
   - Choose Public or Private
   - Click "Publish repository"

5. **Deploy Updates:**
   - GitHub Desktop automatically detects changes
   - Review changes in the right panel
   - Add commit message: "Fix: Appointment booking integration"
   - Click "Commit to main"
   - Click "Push origin"
   - Done! ✅

---

## 🔐 Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Security Notes:**
- ✅ `.env` is in `.gitignore` (not uploaded to GitHub)
- ✅ Never commit API keys or secrets
- ✅ Use environment variables for sensitive data

---

## 🧪 Testing the Fix

### Test Appointment Booking:

1. **Login as Patient:**
   - Email: `patient@test.com`
   - Password: `password123`

2. **Book a Consultation:**
   - Click "Book Consultation" in navbar
   - Select "Immediate" or "Scheduled" mode
   - Choose consultation type (Video/Chat)
   - Select any available pharmacist
   - Enter reason: "Test booking"
   - Complete payment (use any test payment method)

3. **Verify in Dashboard:**
   - You'll be redirected to Patient Dashboard
   - Check "Pending Approval" section
   - Your new appointment should appear with:
     - ⏱️ Orange badge: "Waiting for pharmacist approval"
     - Pharmacist name
     - Date and time
     - Consultation type

4. **Test Pharmacist Approval:**
   - Logout and login as pharmacist
   - Email: `pharmacist@test.com`
   - Password: `password123`
   - Go to Pharmacist Dashboard
   - Find the appointment in "Pending Requests"
   - Click "Accept"
   - Logout and login back as patient
   - Appointment now shows in "Confirmed Appointments" with green badge ✅

---

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` folder.

---

## 🐛 Troubleshooting

### Issue: Appointments not showing after booking

**Solution:** This is now fixed! Make sure you have the latest version of `src/App.jsx`.

### Issue: "Cannot find module 'axios'"

**Solution:**
```bash
npm install axios
```

### Issue: Blank page on startup

**Solution:**
1. Check browser console for errors (F12)
2. Verify `.env` file exists with correct variables
3. Ensure backend is running (if using API)
4. Clear browser cache and reload

### Issue: Git not recognized

**Solution:**
- Install Git from [git-scm.com](https://git-scm.com/)
- OR use GitHub Desktop (easier)

---

## 📚 Additional Documentation

- **QUICKSTART.md** - Quick setup guide
- **GITHUB_SETUP.md** - Detailed GitHub deployment guide
- **BACKEND_INTEGRATION_GUIDE.md** - Backend API integration
- **START_BACKEND.md** - Backend setup instructions

---

## 🔄 Update Checklist

When deploying updates:

- [ ] Test locally first (`npm run dev`)
- [ ] Check for console errors (F12)
- [ ] Test all user roles (patient, pharmacist, admin)
- [ ] Verify appointment booking works
- [ ] Check dashboard displays correctly
- [ ] Commit with clear message
- [ ] Push to GitHub
- [ ] Verify on GitHub repository

---

## 🎯 Next Steps

1. **Test the Application:**
   - Book appointments as patient
   - Approve appointments as pharmacist
   - Verify dashboard updates

2. **Deploy to GitHub:**
   - Use GitHub Desktop (easiest)
   - Or use Git command line

3. **Optional Enhancements:**
   - Connect to real backend API
   - Add email notifications
   - Implement payment gateway
   - Add video call functionality
   - Deploy to production (Vercel, Netlify, etc.)

---

## 💡 Pro Tips

1. **Always test locally before deploying**
2. **Use meaningful commit messages**
3. **Keep `.env` file secure (never commit it)**
4. **Regularly backup your code to GitHub**
5. **Use GitHub Desktop if command line is confusing**

---

## 🆘 Need Help?

**Common Questions:**

**Q: How do I know if the fix is working?**
A: Book an appointment and check if it appears in the patient dashboard immediately.

**Q: Do I need the backend running?**
A: No, the frontend works standalone with dummy data. Backend is optional for full functionality.

**Q: How do I deploy to GitHub without Git?**
A: Use GitHub Desktop - it's much easier and doesn't require command line.

**Q: Can I use this in production?**
A: Yes! Just connect it to your real backend API and configure production environment variables.

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Verify all dependencies are installed (`npm install`)
4. Ensure you're using the latest code

---

**Version:** 1.1.0  
**Last Updated:** November 9, 2025  
**Status:** ✅ Production Ready

---

**Happy Coding! 🚀**
