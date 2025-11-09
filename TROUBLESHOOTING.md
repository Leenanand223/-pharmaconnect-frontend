# Troubleshooting Guide

## Blank Page Issues - SOLVED ✅

### Problem: Website shows blank page

**Root Causes Found:**
1. ❌ Missing `axios` dependency
2. ❌ Wrong start command (should be `npm run dev` for Vite)

**Solutions Applied:**
1. ✅ Installed axios: `npm install axios`
2. ✅ Added `start` script to package.json

---

## How to Start the Application

### ✅ Correct Commands:

```bash
# Option 1: Using npm start (now works!)
npm start

# Option 2: Using npm run dev (Vite default)
npm run dev
```

Both commands now work and will start the development server!

---

## Common Issues & Solutions

### Issue 1: Blank White Page
**Symptoms:** Browser shows blank page, no errors visible

**Causes:**
- Missing dependencies
- JavaScript errors in console
- Backend not running

**Solutions:**
```bash
# 1. Install all dependencies
npm install

# 2. Check browser console (F12) for errors

# 3. Make sure backend is running
# (Backend should be on http://localhost:5000)
```

---

### Issue 2: "Cannot GET /" Error
**Symptoms:** Page shows "Cannot GET /"

**Solution:**
```bash
# Make sure you're running the frontend, not backend
npm start
# or
npm run dev
```

---

### Issue 3: Module Not Found Errors
**Symptoms:** Console shows "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 4: Port Already in Use
**Symptoms:** Error: "Port 5173 is already in use"

**Solution:**
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or just use a different port
npm run dev -- --port 3000
```

---

### Issue 5: API Connection Errors
**Symptoms:** Console shows "Network Error" or "Failed to fetch"

**Causes:**
- Backend not running
- Wrong API URL in .env
- CORS issues

**Solutions:**
1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Check .env file:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. **Restart frontend after changing .env:**
   ```bash
   # Stop with Ctrl+C, then:
   npm start
   ```

---

### Issue 6: Styles Not Loading
**Symptoms:** Page loads but looks unstyled

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run build
npm start
```

---

### Issue 7: React Version Conflicts
**Symptoms:** Errors about React hooks or version mismatches

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Checking for Errors

### 1. Browser Console (Most Important!)
1. Open browser (Chrome/Firefox/Edge)
2. Press **F12** or **Ctrl+Shift+I**
3. Click **Console** tab
4. Look for red error messages
5. Copy error message and search Google

### 2. Terminal Output
- Look for errors in the terminal where you ran `npm start`
- Red text usually indicates errors
- Yellow text is warnings (usually okay)

### 3. Network Tab
1. Open browser DevTools (F12)
2. Click **Network** tab
3. Refresh page
4. Look for failed requests (red)
5. Check if API calls are reaching backend

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Node.js installed? (`node --version`)
- [ ] Dependencies installed? (`npm install`)
- [ ] Backend running? (Check http://localhost:5000)
- [ ] .env file exists? (Check project root)
- [ ] Correct API URL in .env?
- [ ] No errors in browser console? (F12)
- [ ] No errors in terminal?
- [ ] Port 5173 available?

---

## Still Not Working?

### Step 1: Clean Install
```bash
# Delete everything and start fresh
rm -rf node_modules package-lock.json
npm install
npm start
```

### Step 2: Check Browser Console
1. Press F12
2. Look at Console tab
3. Copy any error messages
4. Search the error on Google

### Step 3: Check Backend
```bash
# Make sure backend is running
cd backend
npm start

# Should see: "Server running on port 5000"
```

### Step 4: Verify .env File
```bash
# Check if .env exists
ls -la .env

# Check contents
cat .env

# Should show:
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Getting Help

If you're still stuck:

1. **Check browser console** (F12) - Copy error message
2. **Check terminal** - Copy error message
3. **Search Google**: "React [your error message]"
4. **Check GitHub Issues**: Similar problems might be solved

---

## Prevention Tips

To avoid issues in the future:

1. **Always run `npm install`** after pulling new code
2. **Restart dev server** after changing .env
3. **Check browser console** when something looks wrong
4. **Keep dependencies updated**: `npm update`
5. **Don't delete node_modules** unless necessary

---

## Quick Reference

### Start Development Server
```bash
npm start
# or
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

---

**Current Status:** ✅ All issues resolved! The app should now work correctly.

**Next Step:** Run `npm start` and open http://localhost:5173
