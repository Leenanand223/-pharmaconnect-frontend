# Environment Setup Guide

## What is a .env file?

A `.env` file stores configuration settings for your application. Think of it like a settings file that tells your app where to find the backend server.

## ✅ Already Done For You!

I've already created the `.env` file with default settings for local development:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## When to Change These Settings

### For Local Development (Default - No Changes Needed)
If you're running the backend on your computer, the default settings work perfectly:
- Backend API: `http://localhost:5000/api`
- Socket Server: `http://localhost:5000`

**Just make sure your backend is running on port 5000!**

### For Production Deployment
When you deploy to a live server, you need to update these URLs:

1. Open the `.env` file
2. Replace the URLs with your actual backend domain:

```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_SOCKET_URL=https://your-backend.com
```

## Example Scenarios

### Scenario 1: Testing Locally
```env
# Backend running on your computer
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Scenario 2: Backend on Different Port
```env
# If your backend runs on port 3001
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

### Scenario 3: Production Deployment
```env
# Backend deployed on Heroku/Railway/etc
REACT_APP_API_URL=https://pharmaconnect-api.herokuapp.com/api
REACT_APP_SOCKET_URL=https://pharmaconnect-api.herokuapp.com
```

### Scenario 4: Backend on Different Computer (Same Network)
```env
# Backend running on another computer with IP 192.168.1.100
REACT_APP_API_URL=http://192.168.1.100:5000/api
REACT_APP_SOCKET_URL=http://192.168.1.100:5000
```

## How to Edit .env File

### Method 1: Using VS Code (Recommended)
1. Open your project in VS Code
2. Find `.env` file in the file explorer
3. Click to open it
4. Edit the URLs
5. Save (Ctrl+S or Cmd+S)

### Method 2: Using Notepad (Windows)
1. Right-click `.env` file
2. Open with → Notepad
3. Edit the URLs
4. Save and close

### Method 3: Using Any Text Editor
Just open `.env` with any text editor and modify the values

## Important Notes

⚠️ **After changing .env file:**
1. Stop your React app (Ctrl+C in terminal)
2. Start it again: `npm start`
3. Changes will now take effect

⚠️ **Security:**
- Never commit `.env` to Git (already added to .gitignore)
- Never share your `.env` file publicly
- Each developer should have their own `.env` file

⚠️ **File Name:**
- Must be exactly `.env` (with the dot at the start)
- Not `env.txt` or `.env.txt`
- The dot makes it a hidden file on Mac/Linux

## Troubleshooting

### Problem: "Cannot connect to backend"
**Solution:** Check that:
1. Backend server is actually running
2. URLs in `.env` are correct
3. You restarted the React app after changing `.env`

### Problem: "Changes not working"
**Solution:** 
1. Stop React app (Ctrl+C)
2. Start again: `npm start`
3. Environment variables only load on startup

### Problem: "File not found"
**Solution:**
- Make sure `.env` is in the root folder (same level as `package.json`)
- Check the file name is exactly `.env`

## Quick Test

To verify your setup is working:

1. Start your backend server
2. Start your React app: `npm start`
3. Try to login with test account
4. If login works → ✅ Setup is correct!
5. If you see connection errors → Check the URLs in `.env`

## Need Help?

If you're still confused:
1. The `.env` file is already created with default settings
2. If your backend runs on `localhost:5000`, you don't need to change anything
3. Just start both backend and frontend, and it should work!

---

**Current Status:** ✅ `.env` file created with local development settings
**Next Step:** Start your backend server, then start the React app!
