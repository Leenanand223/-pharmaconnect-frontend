// Data Service - Handles appointments, prescriptions, etc.
import apiService from './api';

class DataService {
  // Appointments
  async getAppointments() {
    try {
      return await apiService.getAppointments();
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return { appointments: [] };
    }
  }

  async bookAppointment(appointmentData) {
    try {
      return await apiService.bookAppointment(appointmentData);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      return { success: false, error: error.message };
    }
  }

  async updateAppointmentStatus(appointmentId, status) {
    try {
      return await apiService.updateAppointmentStatus(appointmentId, status);
    } catch (error) {
      console.error('Failed to update appointment:', error);
      return { success: false, error: error.message };
    }
  }

  // Pharmacists
  async getPharmacists() {
    try {
      return await apiService.getPharmacists();
    } catch (error) {
      console.error('Failed to fetch pharmacists:', error);
      return { pharmacists: [] };
    }
  }

  async getPharmacistAvailability(pharmacistId, date) {
    try {
      return await apiService.getPharmacistAvailability(pharmacistId, date);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      return { timeSlots: [] };
    }
  }

  // Prescriptions
  async getPrescriptions() {
    try {
      return await apiService.getPrescriptions();
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
      return { prescriptions: [] };
    }
  }

  async createPrescriptionRequest(formData) {
    try {
      return await apiService.createPrescriptionRequest(formData);
    } catch (error) {
      console.error('Failed to create prescription request:', error);
      return { success: false, error: error.message };
    }
  }

  // Chat
  async getChatMessages(appointmentId) {
    try {
      return await apiService.getChatMessages(appointmentId);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      return { messages: [] };
    }
  }

  async sendMessage(appointmentId, message) {
    try {
      return await apiService.sendMessage(appointmentId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: error.message };
    }
  }

  // Video Sessions
  async createVideoSession(appointmentId) {
    try {
      return await apiService.createVideoSession(appointmentId);
    } catch (error) {
      console.error('Failed to create video session:', error);
      return { success: false, error: error.message };
    }
  }

  async joinVideoSession(roomId) {
    try {
      return await apiService.joinVideoSession(roomId);
    } catch (error) {
      console.error('Failed to join video session:', error);
      return { success: false, error: error.message };
    }
  }

  async endVideoSession(roomId) {
    try {
      return await apiService.endVideoSession(roomId);
    } catch (error) {
      console.error('Failed to end video session:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics (Admin)
  async getAnalytics(timeRange = '7days') {
    try {
      return await apiService.getAnalytics(timeRange);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return { analytics: {} };
    }
  }

  // User Management (Admin)
  async getUsers() {
    try {
      return await apiService.getUsers();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return { users: [] };
    }
  }

  async updateUserStatus(userId, status) {
    try {
      return await apiService.updateUserStatus(userId, status);
    } catch (error) {
      console.error('Failed to update user status:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
