# 🚀 Start Backend Server

## Quick Start

### Step 1: Open a New Terminal

Open a **separate terminal window** (don't close your frontend terminal)

### Step 2: Navigate to Backend

```bash
cd backend
```

### Step 3: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 4: Initialize Database (First Time Only)

```bash
npm run init-db
```

You should see:
```
✅ Database initialization completed successfully!
📊 Default users created:
   Patient: john@example.com / password123
   Pharmacist: sarah@example.com / password123
   Admin: admin@example.com / password123
```

### Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 PharmaConnect Backend running on port 5000
📊 Health check: http://localhost:5000/api/health
```

### Step 6: Verify Backend is Running

Open a browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"OK","timestamp":"2025-11-07T..."}
```

---

## ✅ Backend is Ready!

Now you can:
1. Switch to production mode in `src/config.js`
2. Restart your frontend
3. Sign in with test accounts

---

## 🔍 Troubleshooting

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Database Errors

**Error:** Database initialization failed

**Solution:**
```bash
# Delete old database and recreate
cd backend
del database.sqlite
npm run init-db
```

### Module Not Found

**Error:** Cannot find module 'express'

**Solution:**
```bash
cd backend
npm install
```

---

## 📊 Backend Status Check

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

---

## 🛑 Stop Backend

Press `Ctrl + C` in the backend terminal

---

## 📝 Test Accounts

After running `npm run init-db`:

| Role | Email | Password |
|------|-------|----------|
| Patient | john@example.com | password123 |
| Pharmacist | sarah@example.com | password123 |
| Admin | admin@example.com | password123 |

---

## 🎯 Next Steps

1. ✅ Backend running on port 5000
2. ✅ Database initialized with test users
3. 🔄 Switch to production mode in `src/config.js`
4. 🔄 Restart frontend
5. 🔄 Sign in with test accounts

**Your backend is ready for production mode!**
