import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/moncon';

export const getRegistersAvisos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/avisos`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon data:', error);
    throw error;
  }
};

export const createRegisterAviso = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/avisos`, data);
    return response;
  } catch (error) {
    console.error('Error creating Moncon aviso:', error);
    throw error;
  }
}

export const updateRegisterAviso = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/avisos/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating Moncon aviso:', error);
    throw error;
  }
}

export const deleteRegisterAviso = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/avisos/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting Moncon aviso:', error);
    throw error;
  }
}
