import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api/problems' : '/api/problems');

// Fetch all problems (supports optional query parameters like search, platform, difficulty, topic, status)
export const getProblems = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Fetch single problem by ID
export const getProblemById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new problem
export const createProblem = async (problemData) => {
  const response = await axios.post(API_URL, problemData);
  return response.data;
};

// Update an existing problem
export const updateProblem = async (id, problemData) => {
  const response = await axios.put(`${API_URL}/${id}`, problemData);
  return response.data;
};

// Delete a problem
export const deleteProblem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Update problem status (Solved / Unsolved)
export const updateProblemStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

// Fetch dashboard statistics
export const getProblemStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
