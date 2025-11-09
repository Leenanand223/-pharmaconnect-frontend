// Authentication Service
import apiService from './api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadUserFromStorage();
  }

  // Load user from localStorage
  loadUserFromStorage() {
    const storedUser = localStorage.getItem('pharmaconnect_user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Save user to localStorage
  saveUserToStorage(user) {
    localStorage.setItem('pharmaconnect_user', JSON.stringify(user));
    this.currentUser = user;
  }

  // Clear user from storage
  clearUserFromStorage() {
    localStorage.removeItem('pharmaconnect_user');
    localStorage.removeItem('pharmaconnect_token');
    this.currentUser = null;
  }

  // Login
  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      this.saveUserToStorage(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login failed:', error);
      
      // Fallback to demo mode if backend is unavailable
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.log('Backend unavailable, using demo mode');
        return this.loginDemoMode(email, password);
      }
      
      return { success: false, error: error.message };
    }
  }

  // Demo mode login (when backend is unavailable)
  loginDemoMode(email, password) {
    const demoUsers = {
      'patient@test.com': {
        id: 1,
        name: 'Rahul Sharma',
        email: 'patient@test.com',
        role: 'patient',
        phone: '+91-98765-43210',
        address: 'Sector 15, Chandigarh, Punjab'
      },
      'pharmacist@test.com': {
        id: 2,
        name: 'Dr. Priya Sharma',
        email: 'pharmacist@test.com',
        role: 'pharmacist',
        phone: '+91-98765-43211',
        license: 'PCI-12345',
        specialization: 'Clinical Pharmacy'
      },
      'admin@test.com': {
        id: 3,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        phone: '+91-98765-43212'
      }
    };

    const user = demoUsers[email];
    
    if (user && password === 'password123') {
      this.saveUserToStorage(user);
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid credentials. Use password123 for demo accounts.' };
  }

  // Register
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      this.saveUserToStorage(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Fallback to demo mode if backend is unavailable
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.log('Backend unavailable, using demo mode for registration');
        return this.registerDemoMode(userData);
      }
      
      return { success: false, error: error.message };
    }
  }

  // Demo mode registration (when backend is unavailable)
  registerDemoMode(userData) {
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'patient',
      phone: userData.phone || '',
      address: userData.address || ''
    };
    
    this.saveUserToStorage(newUser);
    return { success: true, user: newUser };
  }

  // Logout
  logout() {
    apiService.logout();
    this.clearUserFromStorage();
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      await apiService.updateProfile(profileData);
      const updatedUser = { ...this.currentUser, ...profileData };
      this.saveUserToStorage(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
