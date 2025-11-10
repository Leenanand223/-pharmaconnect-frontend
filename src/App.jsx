import React, { useState, useEffect } from 'react';
import Chatbot from "./components/chatbot";
import VideoCall from "./components/VideoCall";
import authService from './services/authService';
import dataService from './services/dataService';
import apiService from './services/api';
import { config } from './config';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Video, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Users, 
  Activity, 
  MessageCircle, 
  Upload,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Zap,
  HeartHandshake,
  BarChart,
  TrendingUp,
  Mail,
  MapPin,
  Clipboard,
  AlertCircle,
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Award, 
  Pill,
  ShieldCheck,
  Heart, 
  UserCircle,
  Stethoscope, 
  CheckCircle
} from 'lucide-react';

// Dummy Data
const dummyData = {
  users: {
    patient: {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      role: 'patient',
      phone: '+91-98765-43210',
      address: 'Sector 15, Chandigarh, Punjab'
    },
    pharmacist: {
      id: 2,
      name: 'Dr. Priya Sharma',
      email: 'priya@example.com',
      role: 'pharmacist',
      phone: '+91-98765-43211',
      license: 'PCI-12345',
      specialization: 'Clinical Pharmacy'
    },
    admin: {
      id: 3,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      phone: '+91-98765-43212'
    }
  },
  appointments: [
    { id: 1, patientName: 'Rahul Sharma', pharmacistName: 'Dr. Priya Sharma', date: 'Nov 8, 2025', time: '10:30 AM', status: 'pending', type: 'Medication consultation', schedulingMode: 'immediate' },
    { id: 2, patientName: 'Anita Singh', pharmacistName: 'Dr. Priya Sharma', date: '2025-11-10', time: '2:00 PM', status: 'pending', type: 'Side effects concern', schedulingMode: 'scheduled' },
    { id: 3, patientName: 'Sneha Agarwal', pharmacistName: 'Dr. Priya Sharma', date: 'Nov 8, 2025', time: '11:15 AM', status: 'pending', type: 'General consultation', schedulingMode: 'immediate' },
    { id: 4, patientName: 'Vikram Patel', pharmacistName: 'Dr. Priya Sharma', date: '2025-11-09', time: '3:00 PM', status: 'scheduled', type: 'Follow-up', schedulingMode: 'scheduled' },
    { id: 5, patientName: 'Priya Gupta', pharmacistName: 'Dr. Rajesh Kumar', date: '2025-11-05', time: '11:00 AM', status: 'completed', type: 'Medication review', schedulingMode: 'scheduled' }
  ],
  prescriptions: [
    { id: 1, patientName: 'Rahul Sharma', medication: 'Amoxicillin 500mg', dosage: '3 times daily', date: '2025-10-25', status: 'active' },
    { id: 2, patientName: 'Anita Singh', medication: 'Telmisartan 40mg', dosage: '1 time daily', date: '2025-10-20', status: 'active' },
    { id: 3, patientName: 'Vikram Patel', medication: 'Metformin 850mg', dosage: '2 times daily', date: '2025-10-15', status: 'completed' }
  ],
  testimonials: [
    { id: 1, name: 'Priya Gupta', text: 'PharmaConnect made it so easy to get expert advice on my medications. The pharmacists are knowledgeable and caring. Great service!', rating: 5 },
    { id: 2, name: 'Arjun Mehta', text: 'I love being able to consult with pharmacists from home. The video quality is excellent and the service is very professional.', rating: 5 },
    { id: 3, name: 'Sneha Agarwal', text: 'As a busy working mother, PharmaConnect saves me so much time. Quick consultations and reliable prescription guidance.', rating: 5 }
  ],
  chatMessages: [
    { id: 1, sender: 'Dr. Priya Sharma', message: 'Hello! How are you feeling today?', time: '10:05 AM', isPharmacist: true },
    { id: 2, sender: 'Rahul Sharma', message: 'Hi Dr. Priya! I have some questions about my medication.', time: '10:06 AM', isPharmacist: false },
    { id: 3, sender: 'Dr. Priya Sharma', message: 'Of course! What would you like to know?', time: '10:07 AM', isPharmacist: true }
  ],
  timeSlots: [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: false },
    { time: '4:00 PM', available: true }
  ]
};

// Navigation Component
const Navbar = ({ currentUser, navigate, logout, isMobileMenuOpen, setIsMobileMenuOpen, currentPage }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getDashboardRoute = () => {
    if (!currentUser) return 'home';
    switch (currentUser.role) {
      case 'patient': return 'patient-dashboard';
      case 'pharmacist': return 'pharmacist-dashboard';
      case 'admin': return 'admin-dashboard';
      default: return 'home';
    }
  };

  const getUserRoleColor = () => {
    switch (currentUser?.role) {
      case 'patient': return 'text-green-600';
      case 'pharmacist': return 'text-purple-600';
      case 'admin': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const isHomePage = currentPage === 'home';

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HeartHandshake className="h-8 w-8" />
              <span className="text-xl font-bold">PharmaConnect</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!currentUser ? (
              /* Guest Navigation */
              <>
                {!isHomePage && (
                  <>
                    <button 
                      onClick={() => navigate('home')} 
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      Home
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                  </>
                )}
                {currentPage === 'login' ? (
                  /* Login page - show sign up */
                  <button 
                    onClick={() => navigate('register')} 
                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all transform hover:scale-105 font-medium shadow-md"
                  >
                    Sign Up
                  </button>
                ) : currentPage === 'register' ? (
                  /* Register page - show sign in */
                  <button 
                    onClick={() => navigate('login')} 
                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all transform hover:scale-105 font-medium shadow-md"
                  >
                    Sign In
                  </button>
                ) : (
                  /* Other pages - show sign in */
                  <button 
                    onClick={() => navigate('login')} 
                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all transform hover:scale-105 font-medium shadow-md"
                  >
                    Sign In
                  </button>
                )}
              </>
            ) : (
              /* Authenticated User Navigation */
              <>
                {/* Dashboard Link */}
                <button 
                  onClick={() => navigate(getDashboardRoute())} 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>

                {/* Role-specific Navigation */}
                {currentUser.role === 'patient' && (
                  <>
                    <button 
                      onClick={() => navigate('appointments')} 
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Book Consultation</span>
                    </button>
                    <button 
                      onClick={() => navigate('chat-pharmacist')} 
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat</span>
                    </button>
                  </>
                )}

                {currentUser.role === 'pharmacist' && (
                  <>
                    <button 
                      onClick={() => navigate('pharmacist-schedule')} 
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Schedule</span>
                    </button>
                  </>
                )}

                <div className="h-4 w-px bg-gray-300"></div>

                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{currentUser.name}</div>
                      <div className={`text-xs ${getUserRoleColor()} capitalize`}>{currentUser.role}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${showUserDropdown ? 'rotate-90' : ''}`} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button 
                        onClick={() => {
                          navigate('profile');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </button>
                      
                      {currentUser.role === 'patient' && (
                        <button 
                          onClick={() => {
                            navigate('prescriptions');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4" />
                          <span>My Prescriptions</span>
                        </button>
                      )}

                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-gray-50">
            <div className="flex flex-col space-y-3">
              {!currentUser ? (
                /* Mobile Guest Navigation */
                <>
                  {!isHomePage && (
                    <button 
                      onClick={() => {
                        navigate('home');
                        setIsMobileMenuOpen(false);
                      }} 
                      className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </button>
                  )}
                  {currentPage === 'register' ? (
                    /* Register page - show sign in */
                    <button 
                      onClick={() => {
                        navigate('login');
                        setIsMobileMenuOpen(false);
                      }} 
                      className="mx-4 bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium text-center flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  ) : currentPage === 'login' ? (
                    /* Login page - show sign up */
                    <button 
                      onClick={() => {
                        navigate('register');
                        setIsMobileMenuOpen(false);
                      }} 
                      className="mx-4 bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium text-center flex items-center justify-center space-x-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Sign Up</span>
                    </button>
                  ) : !isHomePage ? (
                    /* Other pages (not home) - show both options */
                    <>
                      <button 
                        onClick={() => {
                          navigate('login');
                          setIsMobileMenuOpen(false);
                        }} 
                        className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign In</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigate('register');
                          setIsMobileMenuOpen(false);
                        }} 
                        className="mx-4 bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium text-center flex items-center justify-center space-x-2"
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>Get Started</span>
                      </button>
                    </>
                  ) : null}
                </>
              ) : (
                /* Mobile Authenticated Navigation */
                <>
                  <div className="px-4 py-2 border-b border-gray-200 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{currentUser.name}</div>
                        <div className={`text-sm ${getUserRoleColor()} capitalize`}>{currentUser.role}</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      navigate(getDashboardRoute());
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>

                  {currentUser.role === 'patient' && (
                    <>
                      <button 
                        onClick={() => {
                          navigate('appointments');
                          setIsMobileMenuOpen(false);
                        }} 
                        className="text-left px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Book Consultation</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigate('chat-pharmacist');
                          setIsMobileMenuOpen(false);
                        }} 
                        className="text-left px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat with Pharmacist</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigate('prescriptions');
                          setIsMobileMenuOpen(false);
                        }} 
                        className="text-left px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>My Prescriptions</span>
                      </button>
                    </>
                  )}

                  {currentUser.role === 'pharmacist' && (
                    <button 
                      onClick={() => {
                        navigate('pharmacist-schedule');
                        setIsMobileMenuOpen(false);
                      }} 
                      className="text-left px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Schedule</span>
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      navigate('profile');
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </button>

                  <div className="border-t border-gray-200 mx-4 my-2"></div>

                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-left px-4 py-2 text-red-600 hover:text-red-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};



// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HeartHandshake className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">PharmaConnect</span>
            </div>
            <p className="text-gray-400">
              Connecting patients with licensed pharmacists for expert healthcare guidance.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91-1800-PHARMA (1800-742-762)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@pharmaconnect.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Ludhiana, Punjab, India</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">FAQ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">How to book?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance coverage?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Technical support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Emergency contacts</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PharmaConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};




// Home Page Component
const HomePage = ({ navigate, currentUser }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % dummyData.testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % dummyData.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + dummyData.testimonials.length) % dummyData.testimonials.length);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Pharmacists<br />Anytime, Anywhere
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Get expert pharmaceutical guidance through secure video consultations
            </p>

            {/* Guest CTA */}
            {!currentUser && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button 
                  onClick={() => navigate('register')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Get Started</span>
                </button>
                <button 
                  onClick={() => navigate('login')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Logged-in User Actions */}
            {currentUser && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                {currentUser.role === 'patient' && (
                  <>
                    <button 
                      onClick={() => navigate('appointments')}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 flex items-center space-x-2"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Book Consultation</span>
                    </button>
                    <button
                      onClick={() => navigate('patient-dashboard')}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-105"
                    >
                      My Dashboard
                    </button>
                  </>
                )}

                {currentUser.role === 'pharmacist' && (
                  <button
                    onClick={() => navigate('pharmacist-dashboard')}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors transform hover:scale-105"
                  >
                    Pharmacist Dashboard
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => navigate('admin-dashboard')}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            )}

            {/* Value Proposition for Guests */}
            {!currentUser && (
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Shield className="h-12 w-12 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliant</h3>
                  <p className="text-blue-100 text-sm">Your health data is secure and protected</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Clock className="h-12 w-12 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">24/7 Available</h3>
                  <p className="text-blue-100 text-sm">Connect with pharmacists anytime</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Award className="h-12 w-12 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Licensed Experts</h3>
                  <p className="text-blue-100 text-sm">Certified pharmacists you can trust</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Quick Appointment Summary for Logged-in Users */}
      {currentUser && (
        <section className="py-12 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {currentUser.role === 'patient' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {dummyData.appointments.filter(apt => apt.status === 'upcoming').length}
                    </p>
                    <button 
                      onClick={() => navigate('patient-dashboard')}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {dummyData.prescriptions.filter(p => p.status === 'active').length}
                    </p>
                    <button 
                      onClick={() => navigate('prescriptions')}
                      className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Quick Book</h3>
                    <button 
                      onClick={() => navigate('appointments')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
                    >
                      Book Now
                    </button>
                  </div>
                </>
              )}
              
              {currentUser.role === 'pharmacist' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Today's Patients</h3>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <button 
                      onClick={() => navigate('pharmacist-dashboard')}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Schedule →
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">New Requests</h3>
                    <p className="text-2xl font-bold text-green-600">4</p>
                    <button 
                      onClick={() => navigate('pharmacist-dashboard')}
                      className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Review →
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Manage</h3>
                    <button 
                      onClick={() => navigate('pharmacist-schedule')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
                    >
                      My Schedule
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* How It Works & Features Combined - For Guest Users */}
      {!currentUser && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How PharmaConnect Works
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get expert pharmaceutical care in 3 simple steps
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12 mb-20">
              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <UserCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Create Your Account</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Quick 2-minute registration with secure verification. Choose between patient or pharmacist profiles.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Calendar className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Book Consultation</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Browse licensed pharmacists, check availability, and schedule your video consultation instantly.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Get Expert Care</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Connect via secure HIPAA-compliant video for personalized medication guidance and health support.
                </p>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
                Why Choose PharmaConnect?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Secure</h4>
                    <p className="text-gray-600">End-to-end encrypted video calls and secure data handling</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">24/7 Availability</h4>
                    <p className="text-gray-600">Access pharmaceutical expertise anytime, anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Licensed Experts</h4>
                    <p className="text-gray-600">Verified pharmacists with state licenses and certifications</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Chat</h4>
                    <p className="text-gray-600">Instant messaging during and after consultations</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Prescription Review</h4>
                    <p className="text-gray-600">Upload and get expert review of your medications</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h4>
                    <p className="text-gray-600">Access from any device - desktop, tablet, or mobile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section - For Guest Users */}
      {!currentUser && (
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-blue-100">
                Join our growing community of satisfied patients and healthcare professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="text-center group">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4 group-hover:bg-opacity-30 transition-all">
                  <Users className="h-8 w-8 mx-auto mb-2 text-white" />
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <div className="text-blue-100">Happy Patients</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4 group-hover:bg-opacity-30 transition-all">
                  <Stethoscope className="h-8 w-8 mx-auto mb-2 text-white" />
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Licensed Pharmacists</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4 group-hover:bg-opacity-30 transition-all">
                  <Video className="h-8 w-8 mx-auto mb-2 text-white" />
                  <div className="text-4xl font-bold mb-2">50,000+</div>
                  <div className="text-blue-100">Consultations Completed</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4 group-hover:bg-opacity-30 transition-all">
                  <Star className="h-8 w-8 mx-auto mb-2 text-white" />
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <div className="text-blue-100">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-blue-100">End-to-end encryption ensures your medical information stays private</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Licensed Professionals</h3>
                <p className="text-blue-100">All pharmacists are verified and licensed in their respective states</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-blue-100">Round-the-clock access to pharmaceutical expertise when you need it</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
          </div>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 italic">
                "{dummyData.testimonials[currentTestimonial].text}"
              </p>
              <p className="font-semibold text-gray-900">
                {dummyData.testimonials[currentTestimonial].name}
              </p>
            </div>
            
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>


    </div>
  );
};




// Login Page Component
const LoginPage = ({ navigate, login }) => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    setLoginError('');
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
          setLoginError(result.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        setLoginError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => navigate('register')} className="text-blue-600 hover:text-blue-500">
              Register here
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {/* Show login error */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              {loginError}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-xs text-gray-500 text-center mt-4">
            <p>Test accounts:</p>
            <p>Patient: rahul@example.com / password123</p>
            <p>Pharmacist: priya@example.com / password123</p>
            <p>Admin: admin@example.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
};




// Register Page Component

  const RegisterPage = ({ navigate }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    licenseNumber: '', licenseState: '', yearsExperience: '', specialization: '', currentEmployer: '',
    agreeTerms: false, agreeBackground: false, dateOfBirth: '', gender: '', address: '', city: '',
    state: '', zipCode: '', insuranceProvider: '', insuranceId: '', emergencyContact: '',
    emergencyPhone: '', medications: '', allergies: '', conditions: '', agreeHipaa: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = () => {
    if (step < 3) { setStep(step + 1); } else { setSubmitted(true); }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(1);
    setSubmitted(false);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Pill className="w-16 h-16 text-blue-600 mr-4" />
              <h1 className="text-5xl font-bold text-gray-900">Pharma Connect</h1>
            </div>
            <p className="text-xl text-gray-600">Join our telepharmacy platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div onClick={() => handleRoleSelect('pharmacist')} className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-500">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Pharmacist</h2>
              <p className="text-gray-600 text-center mb-6">Join our network and provide remote pharmaceutical care to patients nationwide</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start text-sm text-gray-700">
                  <Video className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Conduct remote video consultations</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <Users className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Flexible scheduling and work hours</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>HIPAA-compliant platform</span>
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                Sign Up as Pharmacist
              </button>
            </div>

            <div onClick={() => handleRoleSelect('patient')} className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Patient</h2>
              <p className="text-gray-600 text-center mb-6">Get expert pharmaceutical care and medication counseling from home</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start text-sm text-gray-700">
                  <Clock className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>24/7 access to licensed pharmacists</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <Heart className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Medication counseling and management</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <Calendar className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Convenient video consultations</span>
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                Sign Up as Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
  const isPharmacist = selectedRole === 'pharmacist';

  // ✅ If it's a patient, go directly to login after registration
  if (!isPharmacist) {
    navigate('login');
    return null;
  }

  // ✅ Pharmacists still see success message
  return (
    <div className={`min-h-screen bg-gradient-to-br ${isPharmacist ? 'from-blue-50 via-white to-green-50' : 'from-green-50 via-white to-blue-50'} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className={`w-20 h-20 ${isPharmacist ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle className={`w-12 h-12 ${isPharmacist ? 'text-blue-600' : 'text-green-600'}`} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">Thank you for applying. Our team will review your credentials and contact you within 2–3 business days.</p>
        <button
          onClick={() => { setSelectedRole(null); setStep(1); setSubmitted(false); }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

  const isPharmacist = selectedRole === 'pharmacist';
  const primaryColor = isPharmacist ? 'blue' : 'green';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isPharmacist ? 'from-blue-50 via-white to-green-50' : 'from-green-50 via-white to-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8 relative">
          <button onClick={() => setSelectedRole(null)} className="absolute left-0 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <Pill className={`w-10 h-10 text-${primaryColor}-600 mr-3`} />
          <h1 className="text-3xl font-bold text-gray-900">TelePharm Connect</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${isPharmacist ? 'from-blue-600 to-green-600' : 'from-green-600 to-blue-600'} p-8 text-white`}>
              <h2 className="text-3xl font-bold mb-2">{isPharmacist ? 'Join Our Pharmacist Network' : 'Start Your Healthcare Journey'}</h2>
              <p className={isPharmacist ? 'text-blue-100' : 'text-green-100'}>{isPharmacist ? 'Provide remote pharmaceutical care nationwide' : 'Connect with licensed pharmacists anytime, anywhere'}</p>
            </div>

            <div className="flex justify-center py-6 px-8 bg-gray-50 border-b">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    {s > 1 && <div className="w-12 h-0.5 bg-gray-300"></div>}
                    <div className={`flex items-center ${step >= s ? `text-${primaryColor}-600` : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? `bg-${primaryColor}-600 text-white` : 'bg-gray-300'}`}>{s}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                  </div>
                  {!isPharmacist && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Gender</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                    </div>
                  )}
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                  {!isPharmacist && (
                    <>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                      <div className="grid grid-cols-3 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">State</label><select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>

    {/* Union Territories */}
    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">
      Dadra and Nagar Haveli and Daman and Diu
    </option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`} /></div>
                  </div>
                </div>
              )}

              {step === 2 && isPharmacist && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">License Number</label><input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                   <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
  <select
    name="licenseState"
    value={formData.licenseState}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>

    {/* Union Territories */}
    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">
      Dadra and Nagar Haveli and Daman and Diu
    </option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select>
</div>

                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Experience</label><select name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><option value="">Select</option><option value="0-2">0-2 years</option><option value="3-5">3-5 years</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label><select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><option value="">Select</option><option value="clinical">Clinical</option><option value="retail">Retail</option></select></div>
                </div>
              )}

              {step === 2 && !isPharmacist && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Health Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label><input type="text" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Insurance ID</label><input type="text" name="insuranceId" value={formData.insuranceId} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label><input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label><input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Medications</label><textarea name="medications" value={formData.medications} onChange={handleChange} rows="2" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label><textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea></div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Terms and Agreement</h3>
                  <div className="space-y-4">
                    <label className="flex items-start cursor-pointer">
                      <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className={`mt-1 mr-3 w-5 h-5 text-${primaryColor}-600 border-gray-300 rounded`} />
                      <span className="text-sm text-gray-700">I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                    {isPharmacist && (
                      <label className="flex items-start cursor-pointer">
                        <input type="checkbox" name="agreeBackground" checked={formData.agreeBackground} onChange={handleChange} className="mt-1 mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded" />
                        <span className="text-sm text-gray-700">I consent to background check and license verification</span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Back</button>}
                <button onClick={handleSubmit} className={`px-8 py-3 bg-gradient-to-r ${isPharmacist ? 'from-blue-600 to-green-600' : 'from-green-600 to-blue-600'} text-white rounded-lg font-medium shadow-lg ${step === 1 ? 'ml-auto' : ''}`}>
                  {step < 3 ? 'Continue' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





const PatientDashboard = ({ navigate, appointments, currentUser }) => {
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    bloodSugar: '95',
    weight: '70'
  });
  const [editMetrics, setEditMetrics] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    bloodSugar: '95',
    weight: '70'
  });
  const [notifications] = useState([
    { id: 1, type: 'appointment', message: 'Appointment reminder: Tomorrow at 10:00 AM', time: '2 hours ago', read: false },
    { id: 2, type: 'prescription', message: 'New prescription uploaded by Dr. Priya Sharma', time: '1 day ago', read: false },
    { id: 3, type: 'message', message: 'You have a new message from your pharmacist', time: '2 days ago', read: true }
  ]);

  // Filter appointments for this patient
  const myAppointments = appointments.filter(apt => 
    apt.patientName === currentUser?.name || apt.patientName === 'John Doe'
  );
  
  const pendingAppointments = myAppointments.filter(apt => apt.status === 'pending');
  const scheduledAppointments = myAppointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = myAppointments.filter(apt => apt.status === 'completed');

  const handleUpdateMetrics = () => {
    setHealthMetrics(editMetrics);
    setShowMetricsModal(false);
    alert('Health metrics updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your health overview.</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 relative"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => navigate('appointments')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book New Appointment</span>
              </button>
            </div>
          </div>
          
          {/* Main Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</dt>
                    <dd className="text-lg font-medium text-gray-900">2</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-between">
                <button onClick={() => navigate('appointments')} className="text-blue-600 hover:text-blue-500 font-medium">
                  View all
                </button>
                <button onClick={() => navigate('appointments')} className="text-green-600 hover:text-green-500 font-medium">
                  Book New
                </button>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center">
                <FileText className="h-6 w-6 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Prescriptions</dt>
                    <dd className="text-lg font-medium text-gray-900">2</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('prescriptions')} className="text-green-600 hover:text-green-500 font-medium">
                  View all
                </button>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center">
                <Video className="h-6 w-6 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Video Consultations</dt>
                    <dd className="text-lg font-medium text-gray-900">5</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('video-consultation')} className="text-purple-600 hover:text-purple-500 font-medium">
                  Start session
                </button>
              </div>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Appointments</h3>
                <button 
                  onClick={() => navigate('appointments')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Book New Appointment
                </button>
              </div>

              {/* Pending Requests */}
              {pendingAppointments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    Pending Approval ({pendingAppointments.length})
                  </h4>
                  <div className="space-y-3">
                    {pendingAppointments.map(appointment => (
                      <div key={appointment.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Consultation with <span className="text-blue-600">{appointment.pharmacistName}</span>
                              </p>
                              <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                              <p className="text-xs text-orange-700 mt-1">{appointment.type}</p>
                              <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Waiting for pharmacist approval
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmed Appointments */}
              {scheduledAppointments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Confirmed Appointments ({scheduledAppointments.length})
                  </h4>
                  <div className="space-y-3">
                    {scheduledAppointments.map(appointment => (
                      <div key={appointment.id} className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Consultation with <span className="text-blue-600">{appointment.pharmacistName}</span>
                              </p>
                              <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                              <p className="text-xs text-green-700 mt-1">{appointment.type}</p>
                              <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Confirmed by pharmacist
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button 
                              onClick={() => navigate('video-consultation')}
                              className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <Video className="h-3 w-3" />
                              <span>Join Call</span>
                            </button>
                            <button 
                              onClick={() => navigate('chat-pharmacist')}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Appointments */}
              {pendingAppointments.length === 0 && scheduledAppointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No appointments yet</p>
                  <button 
                    onClick={() => navigate('appointments')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      Appointment scheduled with <span className="font-medium">Dr. Priya Sharma</span>
                    </p>
                    <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      New prescription uploaded: <span className="font-medium">Amoxicillin 500mg</span>
                    </p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Stats / Quick Overview */}
          <div className="bg-white shadow rounded-lg mb-8 px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-blue-600 mr-2" />
                Health Metrics
              </h3>
              <button 
                onClick={() => {
                  setEditMetrics(healthMetrics);
                  setShowMetricsModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Update Metrics</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Pressure */}
              <div className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 transition-colors"
                   onClick={() => alert('Blood Pressure: ' + healthMetrics.bloodPressure + ' - Status: Normal')}>
                <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h4 className="text-sm text-gray-500 mb-2">Blood Pressure</h4>
                <div className="text-lg font-bold text-blue-600">{healthMetrics.bloodPressure}</div>
                <div className="text-xs text-gray-500">Normal</div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-red-50 rounded-lg p-4 text-center cursor-pointer hover:bg-red-100 transition-colors"
                   onClick={() => alert('Heart Rate: ' + healthMetrics.heartRate + ' bpm - Status: Normal')}>
                <Activity className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <h4 className="text-sm text-gray-500 mb-2">Heart Rate</h4>
                <div className="text-lg font-bold text-red-600">{healthMetrics.heartRate} bpm</div>
                <div className="text-xs text-gray-500">Normal</div>
                <div className="mt-2 h-2 bg-red-200 rounded-full">
                  <div className="h-2 bg-red-600 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Blood Sugar */}
              <div className="bg-yellow-50 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-100 transition-colors"
                   onClick={() => alert('Blood Sugar: ' + healthMetrics.bloodSugar + ' mg/dL - Status: Normal')}>
                <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <h4 className="text-sm text-gray-500 mb-2">Blood Sugar</h4>
                <div className="text-lg font-bold text-yellow-600">{healthMetrics.bloodSugar} mg/dL</div>
                <div className="text-xs text-gray-500">Normal</div>
                <div className="mt-2 h-2 bg-yellow-200 rounded-full">
                  <div className="h-2 bg-yellow-600 rounded-full w-4/5"></div>
                </div>
              </div>

              {/* Weight */}
              <div className="bg-green-50 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100 transition-colors"
                   onClick={() => alert('Weight: ' + healthMetrics.weight + ' kg - Status: Healthy')}>
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h4 className="text-sm text-gray-500 mb-2">Weight</h4>
                <div className="text-lg font-bold text-green-600">{healthMetrics.weight} kg</div>
                <div className="text-xs text-gray-500">Healthy</div>
                <div className="mt-2 h-2 bg-green-200 rounded-full">
                  <div className="h-2 bg-green-600 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
            
          </div>

          {/* AI Health Assistant */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg rounded-lg mb-8 overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Health Assistant</h3>
                      <p className="text-blue-100 text-sm">Get instant answers to your health questions</p>
                    </div>
                  </div>
                  <p className="text-white text-sm mb-4">
                    Ask about medications, side effects, dosage information, or general health advice 24/7
                  </p>
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold flex items-center space-x-2 shadow-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{showChat ? 'Close Assistant' : 'Chat with AI Assistant'}</span>
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">Online 24/7</span>
                    </div>
                    <div className="text-white text-xs opacity-75">
                      Powered by AI • HIPAA Compliant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                <Pill className="h-5 w-5 text-blue-600 mr-2" />
                Medication Reminders & Tips
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Medication Reminder</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Always take your antibiotics with food to avoid stomach upset.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Hydration Tip</p>
                      <p className="text-sm text-green-700 mt-1">
                        Drink plenty of water throughout the day, especially when taking medications.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Timing Matters</p>
                      <p className="text-sm text-purple-700 mt-1">
                        Take your medications at the same time each day for best results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Prescription */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 text-green-600 mr-2" />
                Upload Prescription
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your prescription image for pharmacist review and guidance
              </p>
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      alert('Prescription uploaded: ' + e.target.files[0].name + '\nA pharmacist will review it shortly.');
                    }
                  }} 
                />
              </label>
            </div>
          </div>

          {/* Chatbot Component */}
          {showChat && (
            <div className="fixed bottom-20 right-4 z-[60] w-96 h-[600px] shadow-2xl">
              <Chatbot onClose={() => setShowChat(false)} />
            </div>
          )}

          {/* Health Metrics Update Modal */}
          {showMetricsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Update Health Metrics</h3>
                  <button 
                    onClick={() => setShowMetricsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600 mb-6">
                    Keep your health metrics up to date for better consultation with pharmacists
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure (mmHg)
                      </label>
                      <input
                        type="text"
                        value={editMetrics.bloodPressure}
                        onChange={(e) => setEditMetrics({...editMetrics, bloodPressure: e.target.value})}
                        placeholder="120/80"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="text"
                        value={editMetrics.heartRate}
                        onChange={(e) => setEditMetrics({...editMetrics, heartRate: e.target.value})}
                        placeholder="72"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Sugar (mg/dL)
                      </label>
                      <input
                        type="text"
                        value={editMetrics.bloodSugar}
                        onChange={(e) => setEditMetrics({...editMetrics, bloodSugar: e.target.value})}
                        placeholder="95"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        value={editMetrics.weight}
                        onChange={(e) => setEditMetrics({...editMetrics, weight: e.target.value})}
                        placeholder="70"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowMetricsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateMetrics}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pharmacist Dashboard Component
const PharmacistDashboard = ({ navigate, appointments, onAcceptAppointment, onDeclineAppointment, currentUser }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications] = useState([
    { id: 1, type: 'appointment', message: 'New appointment request from Rahul Sharma', time: '10 minutes ago', read: false },
    { id: 2, type: 'message', message: 'Patient Anita Singh sent you a message', time: '1 hour ago', read: false },
    { id: 3, type: 'prescription', message: 'Prescription request pending review', time: '2 hours ago', read: true }
  ]);

  const handleAcceptAppointment = (appointmentId) => {
    onAcceptAppointment(appointmentId);
    alert('✅ Appointment accepted! Patient will be notified.');
  };

  const handleDeclineAppointment = (appointmentId) => {
    onDeclineAppointment(appointmentId);
    alert('❌ Appointment declined. Patient will be notified and can reschedule.');
  };

  // Filter appointments for this pharmacist
  const myAppointments = appointments.filter(apt => 
    apt.pharmacistName === currentUser?.name || apt.pharmacistName === 'Dr. Priya Sharma'
  );
  
  const pendingRequests = myAppointments.filter(apt => apt.status === 'pending');
  const scheduledAppointments = myAppointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = myAppointments.filter(apt => apt.status === 'completed');
  
  // Separate immediate vs scheduled requests
  const immediateRequests = pendingRequests.filter(apt => apt.schedulingMode === 'immediate');
  const scheduledRequests = pendingRequests.filter(apt => apt.schedulingMode === 'scheduled' || !apt.schedulingMode);
  
  // Calculate today's stats
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = scheduledAppointments.filter(apt => apt.date.includes(todayDate) || apt.date.includes('2025-11'));
  const totalPatients = new Set(myAppointments.map(apt => apt.patientName)).size;
  const activePrescriptions = dummyData.prescriptions.filter(p => p.status === 'active').length;

  const handleUploadPrescription = async () => {
    if (!uploadFile) {
      alert('⚠️ Please select a file to upload');
      return;
    }
    
    if (!selectedPatient) {
      alert('⚠️ Please select a patient');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('prescription', uploadFile);
      formData.append('patientName', selectedPatient);
      formData.append('pharmacistName', currentUser?.name || 'Dr. Priya Sharma');
      formData.append('uploadDate', new Date().toISOString());

      // Show loading state
      const uploadButton = document.querySelector('.upload-prescription-btn');
      if (uploadButton) uploadButton.textContent = 'Uploading...';

      // Call API to upload prescription
      const response = await apiService.uploadPrescriptionToPatient(formData);

      // Success!
      alert('✅ Prescription uploaded successfully!\n\n' + 
            '📋 Patient: ' + selectedPatient + '\n' +
            '📄 File: ' + uploadFile.name + '\n\n' +
            'Patient will be notified and can view it in their dashboard.');
      
      // Close modal and reset
      setShowUploadModal(false);
      setUploadFile(null);
      setSelectedPatient('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Failed to upload prescription\n\n' +
            'Error: ' + error.message + '\n\n' +
            '💡 Make sure the backend server is running on port 5000');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPatient) {
      alert('⚠️ Please select a patient');
      return;
    }
    
    if (!messageText.trim()) {
      alert('⚠️ Please enter a message');
      return;
    }

    try {
      // Prepare message data
      const messageData = {
        patientName: selectedPatient,
        pharmacistName: currentUser?.name || 'Dr. Priya Sharma',
        message: messageText,
        timestamp: new Date().toISOString(),
        type: 'pharmacist_to_patient'
      };

      // Show loading state
      const sendButton = document.querySelector('.send-message-btn');
      if (sendButton) sendButton.textContent = 'Sending...';

      // Call API to send message
      const response = await apiService.sendMessageToPatient(messageData);

      // Success!
      alert('✅ Message sent successfully!\n\n' +
            '👤 To: ' + selectedPatient + '\n' +
            '💬 Message: ' + messageText.substring(0, 50) + '...\n\n' +
            'Patient will receive a notification.');
      
      // Close modal and reset
      setShowMessageModal(false);
      setMessageText('');
      setSelectedPatient('');
    } catch (error) {
      console.error('Send message failed:', error);
      alert('❌ Failed to send message\n\n' +
            'Error: ' + error.message + '\n\n' +
            '💡 Make sure the backend server is running on port 5000');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmacist Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name || 'Dr. Priya Sharma'}!</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 relative"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => navigate('pharmacist-schedule')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>My Schedule</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setAvailabilityStatus(availabilityStatus === 'available' ? 'busy' : 'available')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    availabilityStatus === 'available' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${availabilityStatus === 'available' ? 'bg-white' : 'bg-white'} animate-pulse mr-1`}></div>
                  <span>{availabilityStatus === 'available' ? 'Available' : 'Busy'}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                      <dd className="text-2xl font-bold text-gray-900">{totalPatients}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('pharmacist-schedule')} className="text-blue-600 hover:text-blue-500 font-medium text-sm">
                  View all patients
                </button>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                      <dd className="text-2xl font-bold text-gray-900">{todayAppointments.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('pharmacist-schedule')} className="text-green-600 hover:text-green-500 font-medium text-sm">
                  View schedule
                </button>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                      <dd className="text-2xl font-bold text-gray-900">{pendingRequests.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <span className="text-orange-600 font-medium text-sm">
                  {pendingRequests.length > 0 ? 'Needs attention' : 'All clear'}
                </span>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Prescriptions</dt>
                      <dd className="text-2xl font-bold text-gray-900">{activePrescriptions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('prescriptions')} className="text-purple-600 hover:text-purple-500 font-medium text-sm">
                  Manage prescriptions
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Appointments</h3>
                  <button 
                    onClick={() => navigate('pharmacist-schedule')}
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {scheduledAppointments.length > 0 ? (
                    scheduledAppointments.map(appointment => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.patientName}</p>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {appointment.date} at {appointment.time}
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Confirmed
                                </span>
                                <span className="text-xs text-gray-500">{appointment.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button 
                              onClick={() => navigate('video-consultation')}
                              className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <Video className="h-3 w-3" />
                              <span>Start Call</span>
                            </button>
                            <button 
                              onClick={() => navigate('chat-pharmacist')}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No confirmed appointments for today</p>
                      <p className="text-sm text-gray-400 mt-1">Check appointment requests above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Requests</h3>
                  {pendingRequests.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pendingRequests.length} pending
                    </span>
                  )}
                </div>

                {/* Immediate Consultation Requests */}
                {immediateRequests.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Zap className="h-4 w-4 text-red-600 mr-2" />
                      <h4 className="text-sm font-semibold text-red-700">Immediate Consultations ({immediateRequests.length})</h4>
                    </div>
                    <div className="space-y-3">
                      {immediateRequests.map(request => (
                        <div key={request.id} className="border-2 border-red-300 bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Zap className="h-4 w-4 text-red-600" />
                                <p className="font-medium text-gray-900">{request.patientName}</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  URGENT - Immediate
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Requested: {request.time}
                              </p>
                              <p className="text-xs text-red-700 mt-2 flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {request.type}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => handleAcceptAppointment(request.id)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                <span>Accept</span>
                              </button>
                              <button 
                                onClick={() => handleDeclineAppointment(request.id)}
                                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <X className="h-3 w-3" />
                                <span>Decline</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheduled Appointment Requests */}
                {scheduledRequests.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                      <h4 className="text-sm font-semibold text-orange-700">Scheduled Requests ({scheduledRequests.length})</h4>
                    </div>
                    <div className="space-y-3">
                      {scheduledRequests.map(request => (
                        <div key={request.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-gray-900">{request.patientName}</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  Scheduled
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {request.date} at {request.time}
                              </p>
                              <p className="text-xs text-orange-700 mt-2 flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {request.type}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => handleAcceptAppointment(request.id)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                <span>Accept</span>
                              </button>
                              <button 
                                onClick={() => handleDeclineAppointment(request.id)}
                                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <X className="h-3 w-3" />
                                <span>Decline</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Requests */}
                {pendingRequests.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No pending appointment requests</p>
                    <p className="text-sm text-gray-400 mt-1">All requests have been processed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Appointments Section */}
          {completedAppointments.length > 0 && (
            <div className="bg-white shadow rounded-lg mt-8">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                    Completed Consultations
                  </h3>
                  <span className="text-sm text-gray-500">{completedAppointments.length} total</span>
                </div>
                <div className="space-y-3">
                  {completedAppointments.slice(0, 3).map(appointment => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => alert('View consultation notes for ' + appointment.patientName)}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View Notes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {completedAppointments.length > 3 && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => navigate('pharmacist-schedule')}
                      className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                    >
                      View all {completedAppointments.length} completed consultations →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setShowMessageModal(true)}>
              <MessageCircle className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Send Message</h3>
              <p className="text-blue-100 text-sm">Message your patients directly</p>
              <div className="mt-4 flex items-center text-sm">
                <span>Compose</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setShowUploadModal(true)}>
              <Upload className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Upload Prescription</h3>
              <p className="text-green-100 text-sm">Create digital prescriptions</p>
              <div className="mt-4 flex items-center text-sm">
                <span>Upload Now</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('video-consultation')}>
              <Video className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Video Call</h3>
              <p className="text-purple-100 text-sm">Start video consultations</p>
              <div className="mt-4 flex items-center text-sm">
                <span>Start Call</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('pharmacist-schedule')}>
              <Calendar className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">My Schedule</h3>
              <p className="text-orange-100 text-sm">View full calendar</p>
              <div className="mt-4 flex items-center text-sm">
                <span>Open Calendar</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Prescription Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Prescription</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a patient...</option>
                  {Array.from(new Set(myAppointments.map(apt => apt.patientName))).map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Prescription File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label htmlFor="prescription-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadPrescription}
                  className="upload-prescription-btn flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Message to Patient</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a patient...</option>
                  {Array.from(new Set(myAppointments.map(apt => apt.patientName))).map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="send-message-btn flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Pharmacist Schedule Component
const PharmacistSchedule = ({ navigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'

  const todayAppointments = dummyData.appointments.filter(apt => apt.status === 'upcoming');
  const completedAppointments = dummyData.appointments.filter(apt => apt.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-600">Manage your appointments and availability</p>
            </div>
            <button 
              onClick={() => navigate('pharmacist-dashboard')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* View Mode Selector */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setViewMode('day')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Day View
                  </button>
                  <button 
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Week View
                  </button>
                </div>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {viewMode === 'day' ? "Today's Appointments" : "This Week's Appointments"}
                  </h3>
                  
                  <div className="space-y-4">
                    {todayAppointments.map(appointment => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.patientName}</p>
                              <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Video Call
                                </span>
                                <span className="text-xs text-gray-500">30 min consultation</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate('video-consultation')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <Video className="h-3 w-3" />
                              <span>Start</span>
                            </button>
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                              Reschedule
                            </button>
                            <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {todayAppointments.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No appointments scheduled for today</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Completed Appointments */}
              <div className="bg-white shadow rounded-lg mt-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Completed</h3>
                  <div className="space-y-3">
                    {completedAppointments.slice(0, 3).map(appointment => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Today's Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Appointments</span>
                      <span className="text-lg font-semibold text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="text-lg font-semibold text-green-600">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-lg font-semibold text-orange-600">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue Today</span>
                      <span className="text-lg font-semibold text-purple-600">₹2,400</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Settings */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Update Availability
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      Block Time Slot
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Prescription</span>
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Message</span>
                    </button>
                    <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ navigate }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock chart data
  const appointmentData = {
    '7days': [12, 19, 15, 25, 22, 18, 30],
    '30days': [120, 190, 150, 250, 220, 180, 300, 280, 320, 290, 310, 340, 360, 380, 350, 400, 420, 390, 410, 430, 450, 440, 460, 480, 470, 490, 500, 520, 510, 530],
    '90days': [1200, 1400, 1300, 1600, 1500, 1700, 1800, 1900, 2000, 2100, 2200]
  };

  const userGrowthData = {
    patients: [85, 90, 95, 100, 105, 110, 115],
    pharmacists: [15, 18, 20, 22, 25, 28, 30]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              <button 
                onClick={() => setShowUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Users
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">1,245</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Appointments Today</dt>
                      <dd className="text-lg font-medium text-gray-900">43</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Prescriptions</dt>
                      <dd className="text-lg font-medium text-gray-900">892</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Growth Rate</dt>
                      <dd className="text-lg font-medium text-gray-900">+12%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Appointments Chart */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Appointments Trend</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="h-full flex items-end justify-between space-x-2">
                    {appointmentData[selectedTimeRange].slice(0, 7).map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-blue-600 rounded-t w-full transition-all duration-500 hover:bg-blue-700"
                          style={{ height: `${(value / Math.max(...appointmentData[selectedTimeRange])) * 180}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">
                          {selectedTimeRange === '7days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : `Day ${index + 1}`}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>Total: {appointmentData[selectedTimeRange].reduce((a, b) => a + b, 0)}</span>
                  <span>Avg: {Math.round(appointmentData[selectedTimeRange].reduce((a, b) => a + b, 0) / appointmentData[selectedTimeRange].length)}</span>
                </div>
              </div>
            </div>
            
            {/* User Distribution Pie Chart */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Pie Chart Simulation */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                         style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 85%, 85% 100%, 50% 50%)' }}>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                         style={{ clipPath: 'polygon(50% 50%, 85% 100%, 50% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)' }}>
                    </div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">1,245</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Patients</span>
                    </div>
                    <span className="text-sm font-semibold">1,058 (85%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pharmacists</span>
                    </div>
                    <span className="text-sm font-semibold">187 (15%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue and Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Revenue Growth</h3>
                <div className="h-32 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 flex items-end">
                  <div className="w-full flex items-end justify-between space-x-1">
                    {[45, 52, 48, 61, 55, 67, 73].map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-green-500 rounded-t w-4"
                          style={{ height: `${value}px` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-green-600">₹2,45,000</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Success Rate</h3>
                <div className="h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent transform rotate-45"
                         style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 12%, 50% 50%)' }}>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">94%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">Consultation Success</div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Active Sessions</h3>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">23</div>
                    <div className="text-sm text-gray-600">Live Consultations</div>
                    <div className="mt-2 flex justify-center space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" 
                             style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">New pharmacist registered: Dr. Michael Wilson</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">Peak appointment time reached: 45 concurrent consultations</p>
                    <p className="text-sm text-gray-500">4 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Dummy data for demonstration
// Helper function to get current shift
const getCurrentShift = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return 'morning';
  if (hour >= 14 && hour < 22) return 'afternoon';
  return 'night';
};

// Helper function to check if pharmacist is on duty
const isPharmacistOnDuty = (pharmacist) => {
  const currentShift = getCurrentShift();
  return pharmacist.shifts.includes(currentShift);
};

// Extend dummyData with additional properties
dummyData.timeSlots = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true }
];

dummyData.shifts = {
  morning: { name: 'Morning Shift', start: '06:00', end: '14:00', label: '6 AM - 2 PM' },
  afternoon: { name: 'Afternoon Shift', start: '14:00', end: '22:00', label: '2 PM - 10 PM' },
  night: { name: 'Night Shift (On-Call)', start: '22:00', end: '06:00', label: '10 PM - 6 AM' }
};

dummyData.pharmacists = [
    { 
      id: 1, 
      name: 'Dr. Priya Sharma', 
      specialty: 'Clinical Pharmacy', 
      experience: '8 years', 
      rating: 4.9,
      city: 'Mumbai',
      languages: ['English', 'Hindi', 'Marathi'],
      consultationFee: 299,
      shifts: ['morning', 'afternoon'], // Works morning and afternoon
      status: 'online', // online, busy, offline
      currentAppointments: 3,
      maxAppointments: 12,
      nextAvailable: 'Immediate',
      isOnCall: false
    },
    { 
      id: 2, 
      name: 'Dr. Rajesh Kumar', 
      specialty: 'Pediatric Pharmacy', 
      experience: '12 years', 
      rating: 4.8,
      city: 'Delhi',
      languages: ['English', 'Hindi', 'Punjabi'],
      consultationFee: 349,
      shifts: ['morning'], // Works morning only
      status: 'busy',
      currentAppointments: 8,
      maxAppointments: 12,
      nextAvailable: '30 minutes',
      isOnCall: false
    },
    { 
      id: 3, 
      name: 'Dr. Meera Patel', 
      specialty: 'Geriatric Pharmacy', 
      experience: '6 years', 
      rating: 4.9,
      city: 'Bangalore',
      languages: ['English', 'Hindi', 'Kannada'],
      consultationFee: 299,
      shifts: ['afternoon'], // Works afternoon only
      status: 'online',
      currentAppointments: 5,
      maxAppointments: 12,
      nextAvailable: 'Immediate',
      isOnCall: false
    },
    { 
      id: 4, 
      name: 'Dr. Arjun Singh', 
      specialty: 'Oncology Pharmacy', 
      experience: '10 years', 
      rating: 4.7,
      city: 'Chennai',
      languages: ['English', 'Hindi', 'Tamil'],
      consultationFee: 399,
      shifts: ['afternoon'], // Works afternoon only
      status: 'online',
      currentAppointments: 2,
      maxAppointments: 12,
      nextAvailable: 'Immediate',
      isOnCall: false
    },
    { 
      id: 5, 
      name: 'Dr. Kavya Reddy', 
      specialty: 'Emergency Pharmacy', 
      experience: '7 years', 
      rating: 4.8,
      city: 'Hyderabad',
      languages: ['English', 'Hindi', 'Telugu'],
      consultationFee: 499, // Premium for night shift
      shifts: ['night'], // Night shift on-call
      status: 'online',
      currentAppointments: 1,
      maxAppointments: 8,
      nextAvailable: '~15 minutes',
      isOnCall: true
    },
    { 
      id: 6, 
      name: 'Dr. Amit Gupta', 
      specialty: 'Critical Care Pharmacy', 
      experience: '9 years', 
      rating: 4.9,
      city: 'Pune',
      languages: ['English', 'Hindi', 'Marathi'],
      consultationFee: 349,
      shifts: ['morning', 'afternoon'], // Works morning and afternoon
      status: 'offline', // Currently off duty
      currentAppointments: 0,
      maxAppointments: 12,
      nextAvailable: 'Tomorrow 6 AM',
      isOnCall: false
    }
  ];

const PaymentPage = ({ bookingDetails, onBack, onPaymentComplete }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm, BHIM' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay, Maestro' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'SBI, HDFC, ICICI, Axis & 100+ banks' },
    { id: 'wallet', name: 'Digital Wallets', icon: Wallet, description: 'Paytm, PhonePe, Amazon Pay, Mobikwik' }
  ];

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  const pharmacist = dummyData.pharmacists.find(p => p.id === bookingDetails.pharmacistId);
  const baseConsultationFee = pharmacist?.consultationFee || 299;
  
  // Apply 50% discount for chat consultations
  const consultationFee = bookingDetails.type === 'chat' 
    ? Math.round(baseConsultationFee * 0.5) 
    : baseConsultationFee;
  
  const discount = bookingDetails.type === 'chat' 
    ? baseConsultationFee - consultationFee 
    : 0;
  
  const platformFee = 20;
  const gst = Math.round((consultationFee + platformFee) * 0.18);
  const totalAmount = consultationFee + platformFee + gst;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="mt-2 text-lg text-gray-600">Secure and encrypted payment gateway</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="bg-blue-50 border-b border-blue-100 p-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Select Payment Method
                </h3>
                <p className="text-sm text-gray-600 mt-1">All transactions are 100% secure and encrypted</p>
              </div>
              
              <div className="p-6 space-y-3">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className="w-6 h-6 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">Safe & Secure Payments</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 256-bit SSL encryption</li>
                    <li>• PCI DSS compliant payment gateway</li>
                    <li>• No card details stored on our servers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-4">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Pharmacist</div>
                  <div className="font-medium text-gray-900">{pharmacist?.name}</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {pharmacist?.city}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">
                    {bookingDetails.schedulingMode === 'immediate' ? 'Start Time' : 'Date & Time'}
                  </div>
                  {bookingDetails.schedulingMode === 'immediate' ? (
                    <div className="font-medium text-green-700 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Immediately after payment
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">{bookingDetails.date}</div>
                      <div className="text-sm text-gray-500">{bookingDetails.time}</div>
                    </>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-600">Consultation Type</div>
                  <div className="font-medium text-gray-900 capitalize flex items-center">
                    {bookingDetails.type === 'video' ? (
                      <>
                        <Video className="w-4 h-4 mr-2 text-blue-600" />
                        Video Call
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                        Chat Consultation
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="text-gray-900">₹{consultationFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium mr-2">
                          50% OFF
                        </span>
                        Chat Discount
                      </span>
                      <span className="text-green-600 font-medium">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="text-gray-900">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="text-gray-900">₹{gst}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    !selectedPaymentMethod || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Pay ₹' + totalAmount}
                </button>

                <button
                  onClick={onBack}
                  disabled={isProcessing}
                  className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentBooking = ({ navigate, isLoggedIn = true, userName = 'Guest', currentUser, addAppointment }) => {
  const today = new Date();
  const [schedulingMode, setSchedulingMode] = useState('immediate'); // 'immediate' or 'scheduled'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [consultationType, setConsultationType] = useState('video');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear] = useState(today.getFullYear());
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handleBooking = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      alert('Please login to book an appointment');
      navigate('login');
      return;
    }

    // Validation for scheduled consultations
    if (schedulingMode === 'scheduled') {
      if (!selectedTime) {
        alert('Please select a time slot.');
        return;
      }
      if (!selectedDate) {
        alert('Please select a date.');
        return;
      }
    }
    
    if (!selectedPharmacist) {
      alert('Please select a pharmacist.');
      return;
    }
    if (!reasonForVisit.trim()) {
      alert('Please provide a reason for your consultation.');
      return;
    }

    const pharmacist = dummyData.pharmacists.find(p => p.id === selectedPharmacist);
    
    // Set immediate consultation details
    const now = new Date();
    const immediateDate = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const immediateTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    const details = {
      pharmacistId: selectedPharmacist,
      date: schedulingMode === 'immediate' ? immediateDate : selectedDate,
      time: schedulingMode === 'immediate' ? immediateTime : selectedTime,
      schedulingMode: schedulingMode,
      type: consultationType,
      reason: reasonForVisit,
      pharmacistName: pharmacist.name
    };
    
    setBookingDetails(details);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    // Add the appointment to the state
    if (addAppointment && bookingDetails) {
      addAppointment(bookingDetails);
    }
    
    const pharmacist = dummyData.pharmacists.find(p => p.id === selectedPharmacist);
    alert(
      '✅ Payment Successful!\\n\\nYour appointment is confirmed!\\n\\nDate: ' + bookingDetails.date + '\\nTime: ' + bookingDetails.time + '\\nPharmacist: ' + pharmacist.name + '\\n\\nYou will receive a confirmation email and SMS shortly.'
    );
    
    // Navigate based on user role
    if (currentUser && currentUser.role === 'patient') {
      navigate('patient-dashboard');
    } else if (currentUser && currentUser.role === 'pharmacist') {
      navigate('pharmacist-dashboard');
    } else {
      navigate('home');
    }
  };

  if (showPayment && bookingDetails) {
    return (
      <PaymentPage 
        bookingDetails={bookingDetails}
        onBack={() => setShowPayment(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const emptySlots = Array.from({length: firstDay}, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Your Consultation</h1>
            <p className="mt-2 text-lg text-gray-600">Connect with experienced pharmacists for personalized medication advice</p>
            {isLoggedIn && currentUser && (
              <p className="mt-1 text-sm text-gray-500">Welcome back, {currentUser.name}!</p>
            )}
          </div>
          <button 
            onClick={() => {
              if (currentUser && currentUser.role === 'patient') {
                navigate('patient-dashboard');
              } else if (currentUser && currentUser.role === 'pharmacist') {
                navigate('pharmacist-dashboard');
              } else {
                navigate('home');
              }
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Video className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Video Call</h3>
            </div>
            <p className="text-sm text-gray-600">Face-to-face consultation via secure video</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">30 Minutes</h3>
            </div>
            <p className="text-sm text-gray-600">Dedicated time for your concerns</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
            </div>
            <p className="text-sm text-gray-600">Receive consultation notes and recommendations</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Select Your Pharmacist
            </h3>
            {/* Current Shift Info */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Current Shift: {dummyData.shifts[getCurrentShift()].name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dummyData.shifts[getCurrentShift()].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    {schedulingMode === 'immediate' 
                      ? `${dummyData.pharmacists.filter(p => isPharmacistOnDuty(p) && p.status === 'online').length} Available Now`
                      : `${dummyData.pharmacists.length} Pharmacists - Book Any Time`
                    }
                  </span>
                </div>
              </div>
            </div>

            {schedulingMode === 'scheduled' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <strong>Scheduled Mode:</strong>&nbsp;You can select any pharmacist. They'll confirm your appointment request.
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyData.pharmacists.map(pharmacist => {
                const isOnDuty = isPharmacistOnDuty(pharmacist);
                const isAvailable = pharmacist.status === 'online' && isOnDuty;
                
                // For immediate: only available pharmacists
                // For scheduled: all pharmacists can be selected
                const canSelect = schedulingMode === 'immediate' ? isAvailable : true;
                
                return (
                  <button
                    key={pharmacist.id}
                    onClick={() => canSelect && setSelectedPharmacist(pharmacist.id)}
                    disabled={!canSelect}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      selectedPharmacist === pharmacist.id
                        ? 'border-blue-600 bg-blue-50'
                        : canSelect
                        ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Availability Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {isAvailable ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-700">Available Now</span>
                          </>
                        ) : pharmacist.status === 'busy' && isOnDuty ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-xs font-medium text-yellow-700">Busy</span>
                          </>
                        ) : pharmacist.isOnCall ? (
                          <>
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs font-medium text-purple-700">On-Call</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-500">Off Duty</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-700 ml-1">{pharmacist.rating}</span>
                      </div>
                    </div>

                    <div className="font-semibold text-gray-900 mb-1">{pharmacist.name}</div>
                    <div className="text-sm text-blue-600 font-medium mb-2">{pharmacist.specialty}</div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pharmacist.city}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Award className="w-3 h-3 mr-1" />
                        {pharmacist.experience} experience
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        {pharmacist.currentAppointments}/{pharmacist.maxAppointments} appointments today
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      Languages: {pharmacist.languages.join(', ')}
                    </div>

                    {/* Availability Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {isAvailable ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-green-700 font-medium">
                              ⚡ {pharmacist.nextAvailable}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600">
                              <Video className="w-3 h-3 mr-1" />
                              <span>Video:</span>
                            </div>
                            <span className="font-bold text-blue-600">₹{pharmacist.consultationFee}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center text-gray-600">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span>Chat:</span>
                            </div>
                            <span className="font-bold text-green-600">₹{Math.round(pharmacist.consultationFee * 0.5)}</span>
                          </div>
                        </div>
                      ) : pharmacist.status === 'busy' && isOnDuty ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-yellow-700 font-medium">
                              ⏱️ Next: {pharmacist.nextAvailable}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600">
                              <Video className="w-3 h-3 mr-1" />
                              <span>Video:</span>
                            </div>
                            <span className="font-bold text-gray-600">₹{pharmacist.consultationFee}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center text-gray-600">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span>Chat:</span>
                            </div>
                            <span className="font-bold text-gray-600">₹{Math.round(pharmacist.consultationFee * 0.5)}</span>
                          </div>
                        </div>
                      ) : pharmacist.isOnCall ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-purple-700 font-medium">
                              🌙 {pharmacist.nextAvailable}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600">
                              <Video className="w-3 h-3 mr-1" />
                              <span>Video:</span>
                            </div>
                            <span className="font-bold text-purple-600">₹{pharmacist.consultationFee}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center text-gray-600">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span>Chat:</span>
                            </div>
                            <span className="font-bold text-purple-600">₹{Math.round(pharmacist.consultationFee * 0.5)}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                              Next: {pharmacist.nextAvailable}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600">
                              <Video className="w-3 h-3 mr-1" />
                              <span>Video:</span>
                            </div>
                            <span className="font-bold text-gray-500">₹{pharmacist.consultationFee}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center text-gray-600">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span>Chat:</span>
                            </div>
                            <span className="font-bold text-gray-500">₹{Math.round(pharmacist.consultationFee * 0.5)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {schedulingMode === 'scheduled' ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Select Date
                  </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-base font-medium text-gray-900">
                      {monthNames[currentMonth - 1]} {currentYear}
                    </h4>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {emptySlots.map(i => (
                      <div key={`empty-${i}`} className="p-2"></div>
                    ))}
                    {daysArray.map(day => {
                      const dateStr = currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
                      const todayDate = new Date();
                      todayDate.setHours(0, 0, 0, 0);
                      const currentDate = new Date(currentYear, currentMonth - 1, day);
                      currentDate.setHours(0, 0, 0, 0);
                      const isPast = currentDate < todayDate;
                      
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          disabled={isPast}
                          className={`p-2 text-center text-sm rounded transition-colors ${
                            isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : selectedDate === dateStr
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-blue-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Available Times
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {dummyData.timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        !slot.available 
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                          : selectedTime === slot.time
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{slot.time}</span>
                        <span className={`text-sm font-medium ${slot.available ? 'text-green-600' : 'text-red-600'}`}>
                          {slot.available ? '● Available' : '● Booked'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Immediate Consultation</h3>
                    <p className="text-gray-700 mb-3">
                      You'll be connected with an available pharmacist right after payment. No need to select a date or time!
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="font-medium">Instant Access</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="font-medium">Available 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Consultation Details</h3>
              
              {/* Scheduling Mode Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  When would you like to consult?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSchedulingMode('immediate')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      schedulingMode === 'immediate'
                        ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                    }`}
                  >
                    <Zap className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold mb-1">Start Immediately</div>
                    <div className="text-xs text-gray-600">Connect with available pharmacist now</div>
                    <div className="text-xs font-medium text-green-600 mt-2">⚡ Instant Access</div>
                  </button>
                  <button
                    onClick={() => setSchedulingMode('scheduled')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      schedulingMode === 'scheduled'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold mb-1">Schedule for Later</div>
                    <div className="text-xs text-gray-600">Book a specific date & time</div>
                    <div className="text-xs font-medium text-blue-600 mt-2">📅 Plan Ahead</div>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConsultationType('video')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      consultationType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold mb-1">Video Call</div>
                    <div className="text-xs text-gray-600">Face-to-face consultation</div>
                    <div className="text-sm font-bold text-blue-600 mt-2">Full Price</div>
                  </button>
                  <button
                    onClick={() => setConsultationType('chat')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      consultationType === 'chat'
                        ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                    }`}
                  >
                    <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold mb-1">Chat</div>
                    <div className="text-xs text-gray-600">Text-based consultation</div>
                    <div className="text-sm font-bold text-green-600 mt-2">50% Off</div>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Consultation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="Please describe your medication questions or concerns (e.g., side effects, dosage clarification, drug interactions, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-gray-900 mb-1">Before Your Appointment:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Have your current medications list ready</li>
                      <li>Note any allergies or adverse reactions</li>
                      <li>Prepare questions about your prescriptions</li>
                      <li>Keep your prescription documents handy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Appointment Summary</h4>
                  <p className="text-gray-600 mt-1">
                    {schedulingMode === 'immediate' ? (
                      selectedPharmacist
                        ? (
                          <span className="flex items-center">
                            <Zap className="w-4 h-4 text-green-600 mr-1" />
                            <span className="font-medium text-green-700">Immediate consultation</span>
                            <span className="mx-2">with</span>
                            <span className="font-medium">{dummyData.pharmacists.find(p => p.id === selectedPharmacist)?.name || 'Unknown'}</span>
                          </span>
                        )
                        : 'Please select a pharmacist'
                    ) : (
                      selectedDate && selectedTime && selectedPharmacist
                        ? selectedDate + ' at ' + selectedTime + ' with ' + (dummyData.pharmacists.find(p => p.id === selectedPharmacist)?.name || 'Unknown')
                        : 'Please complete all fields above'
                    )}
                  </p>
                </div>
                <div className="space-x-4">
                  <button 
                    onClick={() => navigate('home')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBooking}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Proceed to Payment
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Chat with Pharmacist Component
const ChatWithPharmacist = ({ navigate }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Priya Sharma', message: 'Hello! How can I help you today?', time: '10:05 AM', isPharmacist: true },
    { id: 2, sender: 'You', message: 'Hi Dr. Priya! I have some questions about my medication side effects.', time: '10:06 AM', isPharmacist: false },
    { id: 3, sender: 'Dr. Priya Sharma', message: 'Of course! Which medication are you concerned about?', time: '10:07 AM', isPharmacist: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPharmacist: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate pharmacist response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          sender: 'Dr. Priya Sharma',
          message: 'Thank you for sharing that. Let me help you with your concern.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isPharmacist: true
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat with Pharmacist</h1>
            <p className="text-gray-600">Get real-time help from licensed pharmacists</p>
          </div>
          <button 
            onClick={() => navigate('patient-dashboard')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Dr. Priya Sharma</h3>
                <p className="text-sm text-gray-600">Clinical Pharmacist • Online</p>
              </div>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.isPharmacist ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isPharmacist 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-blue-600 text-white'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isPharmacist ? 'text-gray-500' : 'text-blue-200'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Chat Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This is for medication-related questions only</li>
                <li>For emergencies, call 911 or visit the nearest hospital</li>
                <li>Pharmacists are available 24/7 for your convenience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Request Prescription Component
const RequestPrescription = ({ navigate }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    quantity: '',
    refills: '',
    reason: '',
    urgency: 'normal',
    doctorName: '',
    doctorPhone: '',
    pharmacyPreference: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Prescription request submitted successfully! You will receive a confirmation email shortly.');
    navigate('patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request New Prescription</h1>
            <p className="text-gray-600">Submit a request for a new prescription or refill</p>
          </div>
          <button 
            onClick={() => navigate('patient-dashboard')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Prescription Details</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.medicationName}
                  onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Amoxicillin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 30 tablets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Refills
                </label>
                <select
                  value={formData.refills}
                  onChange={(e) => setFormData({...formData, refills: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select refills</option>
                  <option value="0">0 (No refills)</option>
                  <option value="1">1 refill</option>
                  <option value="2">2 refills</option>
                  <option value="3">3 refills</option>
                  <option value="5">5 refills</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Request *
              </label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please explain why you need this prescription..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['normal', 'urgent', 'emergency'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, urgency: level})}
                    className={`p-3 rounded-lg border text-center capitalize ${
                      formData.urgency === level
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Phone
                </label>
                <input
                  type="tel"
                  value={formData.doctorPhone}
                  onChange={(e) => setFormData({...formData, doctorPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1-234-567-8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pharmacy
              </label>
              <input
                type="text"
                value={formData.pharmacyPreference}
                onChange={(e) => setFormData({...formData, pharmacyPreference: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CVS Pharmacy, Main Street"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('patient-dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Prescription requests are reviewed by licensed pharmacists</li>
                <li>Processing time: 24-48 hours for normal requests</li>
                <li>You will be contacted if additional information is needed</li>
                <li>For controlled substances, additional verification may be required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Consultation Page Component
const VideoConsultation = ({ navigate, currentUser }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      alert('Message sent: ' + newMessage);
      setNewMessage('');
    }
  };

  const endCall = () => {
    if (confirm('Are you sure you want to end this call?')) {
      // Navigate back to appropriate dashboard based on role
      if (currentUser?.role === 'patient') {
        navigate('patient-dashboard');
      } else if (currentUser?.role === 'pharmacist') {
        navigate('pharmacist-dashboard');
      } else {
        navigate('home');
      }
    }
  };

  // Determine who the other participant is
  const otherParticipant = currentUser?.role === 'patient' 
    ? 'Dr. Priya Sharma (Pharmacist)' 
    : 'Rahul Sharma (Patient)';

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header with call info */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-white font-semibold">{otherParticipant}</h2>
            <p className="text-gray-400 text-sm">Call Duration: {formatDuration(callDuration)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Appointment ID: #12345</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-gray-800">
            {/* Main video (other participant) */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">{otherParticipant}</h3>
                <p className="text-gray-300">Video consultation in progress</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
            </div>
            
            {/* Self video (picture-in-picture) */}
            <div className="absolute bottom-6 right-6 w-56 h-40 bg-gray-700 rounded-lg shadow-2xl overflow-hidden border-2 border-gray-600">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-xs text-gray-300">You ({currentUser?.role || 'User'})</p>
                </div>
              </div>
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center">
                  <p className="text-white text-sm">Camera Off</p>
                </div>
              )}
            </div>
          </div>

          {/* Call Controls */}
          <div className="bg-gray-800 px-6 py-6">
            <div className="flex justify-center items-center space-x-4">
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-full transition-all ${
                  isVideoOn 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                <Video className="h-6 w-6 text-white" />
              </button>
              
              <button 
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-4 rounded-full transition-all ${
                  isAudioOn 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                <Phone className="h-6 w-6 text-white" />
              </button>
              
              <button 
                onClick={endCall}
                className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-all transform hover:scale-110"
                title="End call"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition-all relative"
                title="Toggle chat"
              >
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></span>
              </button>

              <button 
                className="p-4 bg-gray-600 rounded-full hover:bg-gray-500 transition-all"
                title="Settings"
              >
                <Settings className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                {!isVideoOn && '📹 Camera is off • '}
                {!isAudioOn && '🎤 Microphone is muted • '}
                {isVideoOn && isAudioOn && '✅ All systems active'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Consultation Chat</h3>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Messages during this call</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {dummyData.chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.isPharmacist ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                    message.isPharmacist 
                      ? 'bg-white text-gray-900 border border-gray-200' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm font-medium mb-1">{message.sender}</p>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.isPharmacist ? 'text-gray-500' : 'text-blue-200'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Prescriptions Page Component
const PrescriptionsPage = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="mt-2 text-gray-600">View and manage your prescription history</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {dummyData.prescriptions.map(prescription => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{prescription.medication}</h3>
                      <p className="text-sm text-gray-600 mt-1">Dosage: {prescription.dosage}</p>
                      <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                      <p className="text-sm text-gray-600">Prescribed on: {prescription.date}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Instructions: Take with food, complete full course</span>
                      <span>Refills: 2 remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => navigate('request-prescription')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Request New Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = ({ currentUser, navigate }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    license: currentUser?.license || '',
    specialization: currentUser?.specialization || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h2>
          <button 
            onClick={() => navigate('login')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
                <p className="text-gray-600 capitalize">{currentUser.role}</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                {currentUser.role === 'patient' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                )}

                {currentUser.role === 'pharmacist' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={formData.license}
                        onChange={(e) => setFormData({...formData, license: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">SMS Reminders</span>
                <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 404 Not Found Page Component
const NotFoundPage = ({ navigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('home')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 inline mr-2" />
            Back to Home
          </button>
          
          <button 
            onClick={() => navigate('appointments')}
            className="w-full border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
          >
            Book a Consultation
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team at support@pharmaconnect.com</p>
        </div>
      </div>
    </div>
  );
};



// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Appointment state management
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Rahul Sharma', pharmacistName: 'Dr. Priya Sharma', date: 'Nov 8, 2025', time: '10:30 AM', status: 'pending', type: 'Medication consultation', schedulingMode: 'immediate' },
    { id: 2, patientName: 'Sneha Agarwal', pharmacistName: 'Dr. Priya Sharma', date: 'Nov 8, 2025', time: '11:15 AM', status: 'pending', type: 'General consultation', schedulingMode: 'immediate' },
    { id: 3, patientName: 'Anita Singh', pharmacistName: 'Dr. Priya Sharma', date: '2025-11-10', time: '2:00 PM', status: 'pending', type: 'Side effects concern', schedulingMode: 'scheduled' },
    { id: 4, patientName: 'Arjun Mehta', pharmacistName: 'Dr. Priya Sharma', date: '2025-11-09', time: '3:00 PM', status: 'scheduled', type: 'Follow-up', schedulingMode: 'scheduled' },
    { id: 5, patientName: 'Vikram Patel', pharmacistName: 'Dr. Rajesh Kumar', date: '2025-11-05', time: '11:00 AM', status: 'completed', type: 'General consultation', schedulingMode: 'scheduled' }
  ]);

  // Load user from storage on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Handle appointment acceptance
  const handleAcceptAppointment = (appointmentId) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'scheduled' }
          : apt
      )
    );
  };

  // Handle appointment decline
  const handleDeclineAppointment = (appointmentId) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'declined' }
          : apt
      )
    );
  };

  // Add new appointment
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

  const navigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        setCurrentUser(result.user);
        navigate('home');
        return { success: true };
      } else {
        console.error('Login failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentUser={currentUser} 
        navigate={navigate} 
        logout={logout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentPage={currentPage}
      />
      
      <main>
        {currentPage === 'home' && <HomePage navigate={navigate} currentUser={currentUser} />} 
        {currentPage === 'login' && <LoginPage navigate={navigate} login={login} />}
        {currentPage === 'register' && <RegisterPage navigate={navigate} />}
        {currentPage === 'patient-dashboard' && <PatientDashboard navigate={navigate} appointments={appointments} currentUser={currentUser} />}
        {currentPage === 'pharmacist-dashboard' && <PharmacistDashboard navigate={navigate} appointments={appointments} onAcceptAppointment={handleAcceptAppointment} onDeclineAppointment={handleDeclineAppointment} currentUser={currentUser} />}
        {currentPage === 'pharmacist-schedule' && <PharmacistSchedule navigate={navigate} />}
        {currentPage === 'admin-dashboard' && <AdminDashboard navigate={navigate} />}
        {currentPage === 'appointments' && (
          <AppointmentBooking
            navigate={navigate}
            setBookingDetails={setBookingDetails}
            currentUser={currentUser}
            isLoggedIn={!!currentUser}
            userName={currentUser?.name || 'Guest'}
            addAppointment={addAppointment}
          />
        )}

        {/* ✅ Payment Page (connected) */}
        {currentPage === 'payment' && bookingDetails && (
          <PaymentPage
            bookingDetails={bookingDetails}
            onBack={() => navigate('appointments')}
            onPaymentComplete={() => navigate('patient-dashboard')}
          />
        )}
        {currentPage === 'video-consultation' && (
          <VideoCall 
            appointmentId="12345" 
            userName={currentUser?.name || 'User'}
            onEndCall={() => {
              if (currentUser?.role === 'patient') {
                navigate('patient-dashboard');
              } else if (currentUser?.role === 'pharmacist') {
                navigate('pharmacist-dashboard');
              } else {
                navigate('home');
              }
            }}
          />
        )}
        {currentPage === 'chat-pharmacist' && <ChatWithPharmacist navigate={navigate} />}
        {currentPage === 'request-prescription' && <RequestPrescription navigate={navigate} />}
        {currentPage === 'prescriptions' && <PrescriptionsPage navigate={navigate} />}
        {currentPage === 'profile' && <ProfilePage currentUser={currentUser} navigate={navigate} />}
        {currentPage === '404' && <NotFoundPage navigate={navigate} />}
      </main>
      
      {currentPage === 'home' && <Footer />}
    </div>
  );
};

export default App;
