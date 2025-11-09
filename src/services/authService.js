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
      return { success: false, error: error.message };
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      this.saveUserToStorage(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
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
