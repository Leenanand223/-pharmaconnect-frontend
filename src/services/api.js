// API service for PharmaConnect backend integration
import { config } from '../config';

const API_BASE_URL = config.api.baseUrl;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('pharmaconnect_token');
  }

  // Helper method to make authenticated requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('pharmaconnect_token', data.token);
    }

    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('pharmaconnect_token', data.token);
    }

    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('pharmaconnect_token');
  }

  // Appointment methods
  async getAppointments() {
    return this.request('/appointments');
  }

  async bookAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointmentStatus(appointmentId, status) {
    return this.request(`/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getPharmacists() {
    return this.request('/appointments/pharmacists');
  }

  async getPharmacistAvailability(pharmacistId, date) {
    return this.request(`/appointments/pharmacists/${pharmacistId}/availability?date=${date}`);
  }

  // Video consultation methods
  async createVideoSession(appointmentId) {
    return this.request('/video/session', {
      method: 'POST',
      body: JSON.stringify({ appointmentId }),
    });
  }

  async joinVideoSession(roomId) {
    return this.request(`/video/session/${roomId}/join`, {
      method: 'POST',
    });
  }

  async endVideoSession(roomId) {
    return this.request(`/video/session/${roomId}/end`, {
      method: 'POST',
    });
  }

  async getSessionInfo(roomId) {
    return this.request(`/video/session/${roomId}`);
  }

  // Chat methods
  async getChatMessages(appointmentId) {
    return this.request(`/chat/appointment/${appointmentId}`);
  }

  async sendMessage(appointmentId, message) {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, message }),
    });
  }

  async getConversations() {
    return this.request('/chat/conversations');
  }

  // Prescription methods
  async getPrescriptions() {
    return this.request('/prescriptions');
  }

  async createPrescriptionRequest(formData) {
    return this.request('/prescriptions/request', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  }

  async updatePrescription(prescriptionId, prescriptionData) {
    return this.request(`/prescriptions/${prescriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(prescriptionData),
    });
  }

  async getPrescriptionImage(prescriptionId) {
    const url = `${API_BASE_URL}/prescriptions/${prescriptionId}/image`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prescription image');
    }

    return response.blob();
  }

  async deletePrescription(prescriptionId) {
    return this.request(`/prescriptions/${prescriptionId}`, {
      method: 'DELETE',
    });
  }

  // Pharmacist methods - Upload prescription to patient
  async uploadPrescriptionToPatient(formData) {
    const url = `${API_BASE_URL}/prescriptions/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload prescription');
    }

    return data;
  }

  // Send message to patient
  async sendMessageToPatient(messageData) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Get patient messages
  async getPatientMessages(patientId) {
    return this.request(`/messages/patient/${patientId}`);
  }

  // User management methods (Admin)
  async getUsers() {
    return this.request('/users');
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async updateUserRole(userId, role) {
    return this.request(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;