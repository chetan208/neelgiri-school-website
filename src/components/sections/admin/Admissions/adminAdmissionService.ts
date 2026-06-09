import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
const API_BASE_URL = `${SERVER_URL}/api/admissions`;

const apiClient = axios.create({ 
  baseURL: API_BASE_URL,
  withCredentials: true 
});

export const adminAdmissionService = {
  getActiveYear: async () => {
    return (await apiClient.get('/active-admission-year')).data;
  },
  
  openAdmission: async (year: string) => {
    return (await apiClient.post('/open-admissions', { year })).data;
  },
  
  closeAdmission: async (year: string | null) => {
    return (await apiClient.post('/close-admissions', { year })).data;
  },
  
  getPending: async (page = 1, limit = 10, search = '', searchType = 'name', year = '2026-27') => {
    let url = `/view-admissions?year=${year}&pageNumber=${page}&pageSize=${limit}`;
    
    if (search) {
      if (searchType === 'id') {
        url = `/pending-admission-details?id=${search}&year=${year}`;
      } else {
        url = `/pending-admission-details?studentName=${search}&year=${year}&pageNumber=${page}&pageSize=${limit}`;
      }
    }
    
    return (await apiClient.get(url)).data;
  },

  getCompleted: async (page = 1, limit = 10, year = '2026-27') => {
    return (await apiClient.get(`/complete-admission-details?year=${year}&pageNumber=${page}&pageSize=${limit}`)).data;
  },

  updateStatus: async (id: string | number, status: string) => {
    return (await apiClient.put(`/update-admission-status/${id}`, { status })).data;
  }
};