# 💊 PharmaConnect - Online Pharmacy Consultation Platform

A modern, full-featured telemedicine platform connecting patients with licensed pharmacists for expert healthcare guidance. Built with React and designed for the Indian healthcare market.

![React](https://img.shields.io/badge/React-18.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

## ✨ Features

### 👥 For Patients
- 🎥 **Video Consultations** - Face-to-face consultations with pharmacists
- 💬 **Chat Consultations** - Text-based consultations at 50% discount
- ⚡ **Immediate or Scheduled** - Start now or book for later
- 📅 **Appointment Booking** - Easy scheduling with calendar interface
- 💊 **Prescription Management** - Digital prescription storage
- 🔔 **Real-time Notifications** - Stay updated on appointments
- 📱 **Mobile Responsive** - Works on all devices

### 👨‍⚕️ For Pharmacists
- 📊 **Dashboard** - Manage appointments and consultations
- 📅 **Schedule Management** - Set availability and working hours
- 💬 **Patient Communication** - Chat and video with patients
- 📝 **Prescription Creation** - Digital prescription writing
- 📈 **Analytics** - Track consultations and earnings
- 🌙 **24/7 On-Call Support** - Night shift availability

### 🔧 For Administrators
- 📊 **Analytics Dashboard** - Platform statistics and insights
- 👥 **User Management** - Manage patients and pharmacists
- 💰 **Revenue Tracking** - Monitor platform earnings
- 📈 **Growth Metrics** - User and appointment trends
- ⚙️ **System Configuration** - Platform settings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see [Backend Setup](START_BACKEND.md))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/pharmaconnect-frontend.git
cd pharmaconnect-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your backend URL
```

4. **Start the development server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:3000
```

## 🔐 Test Accounts

Use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Patient | rahul@example.com | password123 |
| Pharmacist | priya@example.com | password123 |
| Admin | admin@example.com | password123 |

## 🏗️ Project Structure

```
pharmaconnect-frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── chatbot.jsx  # AI chatbot component
│   │   └── ...
│   ├── services/        # API services
│   │   ├── api.js       # API client
│   │   ├── authService.js
│   │   └── dataService.js
│   ├── App.jsx          # Main application component
│   ├── config.js        # Configuration
│   └── index.js         # Entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **State Management**: React Hooks
- **Routing**: Custom navigation system

## 💳 Payment Integration

Supports Indian payment methods:
- 📱 UPI (Google Pay, PhonePe, Paytm, BHIM)
- 💳 Credit/Debit Cards (Visa, Mastercard, RuPay, Maestro)
- 🏦 Net Banking (SBI, HDFC, ICICI, Axis & 100+ banks)
- 💰 Digital Wallets (Paytm, PhonePe, Amazon Pay, Mobikwik)

## 🌍 Localization

- 🇮🇳 Designed for Indian market
- ₹ Indian Rupee (INR) currency
- Indian cities and languages
- Indian payment methods
- Local phone number formats

## 📱 Key Features

### Consultation Types
- **Video Call**: Full-price face-to-face consultation
- **Chat**: Text-based consultation with 50% discount

### Scheduling Options
- **Immediate**: Connect with available pharmacist right away
- **Scheduled**: Book for specific date and time

### Pricing
- Dynamic pricing based on consultation type
- Transparent fee breakdown
- GST calculation (18%)
- Platform fee included

## 🚀 Deployment

### Environment Variables

For production, set these environment variables:

```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_SOCKET_URL=https://your-backend.com
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md)
- [Backend Setup](START_BACKEND.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)
- [GitHub Setup](GITHUB_SETUP.md)
- [24/7 Availability System](24_7_AVAILABILITY_SYSTEM.md)

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Secure authentication with JWT
- ✅ HTTPS for production
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ No sensitive data in repository

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- All contributors and testers

## 📞 Support

For support, email support@pharmaconnect.in or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered symptom checker
- [ ] Multi-language support
- [ ] Insurance integration
- [ ] Prescription delivery tracking
- [ ] Health records management
- [ ] Telemedicine with doctors
- [ ] Lab test booking

## 📊 Status

- ✅ Production Ready
- ✅ Mobile Responsive
- ✅ API Integration Complete
- ✅ Payment Gateway Ready
- ✅ Real-time Features Working

---

**Made with ❤️ for better healthcare access in India**

⭐ Star this repo if you find it helpful!
