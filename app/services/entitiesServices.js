import axios from 'axios';

// Entities Services - Entities CRUD Operations
// Base URL is set using environment variable NEXT_PUBLIC_API_URL

// Fetch all entities
export const getEntities = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/entities`);
    return response;
  } catch (error) {
    console.error('Error fetching entities:', error);
    throw error;
  }
}
export const getEquipments = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/equipments`);
    return response;
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
}

// Fetch a single entity by ID
export const getEntityById = async (id) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/entities/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching entity by ID:', error);
    throw error;
  }
}

// Create a new entity
export const createEntity = async (data) => {
  try {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/entities`, formData);
    return response;
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
}

// Update an existing entity
export const updateEntity = async (id, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/entities/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating entity:', error);
    throw error;
  }
}

// // Partially update an existing entity
// export const patchEntity = async (id, data) => {
//   try {
//     const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/entities/${id}`, data);
//     return response;
//   } catch (error) {
//     console.error('Error patching entity:', error);
//     throw error;
//   }
// }

// Delete an existing entity
export const deleteEntity = async (id) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/entities/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting entity:', error);
    throw error;
  }
}