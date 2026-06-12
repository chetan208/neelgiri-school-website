import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
const API_BASE_URL = `${SERVER_URL}/api/admissions`;

const apiClient = axios.create({ 
  baseURL: API_BASE_URL,
  withCredentials: true 
});

const getCalculatedSession = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const march31 = new Date(year, 2, 31, 23, 59, 59, 999);
  if (date.getTime() <= march31.getTime()) {
    return `${year - 1}-${String(year).slice(-2)}`;
  } else {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
};

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
  
  getPending: async (page = 1, limit = 10, search = '', searchType = 'name', year?: string) => {
    const queryYear = year || getCalculatedSession();
    let url = `/view-admissions?year=${queryYear}&pageNumber=${page}&pageSize=${limit}`;
    
    if (search) {
      if (searchType === 'id') {
        url = `/pending-admission-details?id=${search}&year=${queryYear}`;
      } else {
        url = `/pending-admission-details?studentName=${search}&year=${queryYear}&pageNumber=${page}&pageSize=${limit}`;
      }
    }
    
    return (await apiClient.get(url)).data;
  },

  getCompleted: async (page = 1, limit = 10, year?: string) => {
    const queryYear = year || getCalculatedSession();
    return (await apiClient.get(`/complete-admission-details?year=${queryYear}&pageNumber=${page}&pageSize=${limit}`)).data;
  },

  updateStatus: async (id: string | number, status: string) => {
    return (await apiClient.put(`/update-admission-status/${id}`, { status })).data;
  }
};