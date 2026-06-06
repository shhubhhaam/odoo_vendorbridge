import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Vendor API
export const vendorAPI = {
  getAll: () => api.get("/vendors"),
  getById: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post("/vendors", data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
};

// RFQ API
export const rfqAPI = {
  getAll: () => api.get("/rfqs"),
  getById: (id) => api.get(`/rfqs/${id}`),
  create: (data) => api.post("/rfqs", data),
  update: (id, data) => api.put(`/rfqs/${id}`, data),
  publish: (id) => api.put(`/rfqs/${id}/publish`, {}),
  submitQuotation: (rfqId, data) => api.post(`/rfqs/${rfqId}/quotations`, data),
  getQuotations: (rfqId) => api.get(`/rfqs/${rfqId}/quotations`),
  delete: (id) => api.delete(`/rfqs/${id}`),
};

// Purchase Order API
export const poAPI = {
  getAll: () => api.get("/purchase-orders"),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post("/purchase-orders", data),
  update: (id, data) => api.put(`/purchase-orders/${id}`, data),
  approve: (id, remarks) => api.put(`/purchase-orders/${id}/approve`, { remarks }),
  reject: (id, remarks) => api.put(`/purchase-orders/${id}/reject`, { remarks }),
  delete: (id) => api.delete(`/purchase-orders/${id}`),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get("/invoices"),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  pay: (id) => api.put(`/invoices/${id}/pay`, {}),
  delete: (id) => api.delete(`/invoices/${id}`),
};

// Activity API
export const activityAPI = {
  getAll: () => api.get("/activities"),
  getByType: (type) => api.get(`/activities/type/${type}`),
};

// Users API
export const userAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;