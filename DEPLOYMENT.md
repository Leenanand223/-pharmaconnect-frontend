# PharmaConnect Deployment Guide

## Production Mode

The application now runs in **production mode only**. Demo mode has been removed for deployment readiness.

## Environment Configuration

### 1. Create Environment File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Update Environment Variables

Edit `.env` with your production values:

```env
# For Local Development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# For Production
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Set environment variables in Netlify dashboard

### Option 3: Traditional Hosting (cPanel, etc.)

1. Build the project:
```bash
npm run build
```

2. Upload the `build` folder contents to your hosting

3. Configure environment variables in your hosting control panel

## Backend Requirements

Ensure your backend API is running and accessible at the URL specified in `REACT_APP_API_URL`.

### Test Accounts

The following test accounts are available:

- **Patient**: rahul@example.com / password123
- **Pharmacist**: priya@example.com / password123
- **Admin**: admin@example.com / password123

## Post-Deployment Checklist

- [ ] Backend API is running and accessible
- [ ] Environment variables are set correctly
- [ ] Test login with all user roles
- [ ] Test appointment booking flow
- [ ] Test video consultation feature
- [ ] Test chat functionality
- [ ] Verify payment integration
- [ ] Check mobile responsiveness

## Troubleshooting

### API Connection Issues

If you see connection errors:

1. Check that `REACT_APP_API_URL` is correct
2. Verify backend is running
3. Check CORS settings on backend
4. Ensure SSL certificates are valid (for HTTPS)

### Build Errors

If build fails:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear cache:
```bash
npm cache clean --force
```

3. Try building again:
```bash
npm run build
```

## Support

For issues or questions, refer to the main README.md or contact the development team.
