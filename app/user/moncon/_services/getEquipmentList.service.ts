import axios from 'axios';

export const getEquipmentList = async () => {
  try {
    const response = await axios.get('/api/equipment-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    throw error;
  }
};