import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
const API_BASE_URL = `${SERVER_URL}/api/admissions`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AdmissionFormData {
  studentName: string;
  FatherName: string;
  MotherName: string;
  dob: string;
  targetClass: string;
  address: string;
  phoneNumber: string;
  email?: string;
}

export const admissionService = {
  async getActiveYear() {
    const response = await apiClient.get('/active-admission-year');
    return response.data;
  },

  async submitForm(data: AdmissionFormData) {
    try {
      const response = await apiClient.post('/submit-admission-form', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Submission failed');
    }
  }
};