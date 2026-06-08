import axios from 'axios';
import { EquipmentListResponse } from './contract/GetEquipmentList.contract';

export const getEquipmentList = async (): Promise<EquipmentListResponse> => {
  try {
    const response = await axios.get('/api/equipment-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    throw error;
  }
};