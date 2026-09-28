import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export const scrapeWebsite = async (url) => {
  const response = await api.post("/scrape/", { url });
  return response.data;
};

export const getRecords = async () => {
  const response = await api.get("/data/");
  return response.data;
};

export const getRecordById = async (id) => {
  const response = await api.get(`/data/${id}`);
  return response.data;
};

export const createRecord = async (data) => {
  const response = await api.post("/data/", data);
  return response.data;
};

export const updateRecord = async (id, data) => {
  const response = await api.put(`/data/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/data/${id}`);
  return response.data;
};

export const getTables = async () => {
  const response = await api.get("/schema/tables");
  return response.data;
};

export const getTableSchema = async (tableName) => {
  const response = await api.get(`/schema/tables/${tableName}`);
  return response.data;
};

export const downloadCsv = async () => {
  const response = await api.get("/export/csv", {
    responseType: "blob",
  });

  return response.data;
};

export default api;
