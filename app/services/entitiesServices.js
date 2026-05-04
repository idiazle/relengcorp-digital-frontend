import axios from 'axios';

// Entities Services - Entities CRUD Operations
// Base URL is set using environment variable NEXT_PUBLIC_API_URL

const buildEntityFormData = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined || value === '') {
      return;
    }

    if (key === 'attachment' && !(value instanceof File) && !(value instanceof Blob)) {
      return;
    }

    if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
}

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

export const getTreeEntities = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/entities/tree`);
    return response;
  } catch (error) {
    console.error('Error fetching tree entities:', error);
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
    const formData = buildEntityFormData(data);
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/entities`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
}

// Update an existing entity
export const updateEntity = async (id, data) => {
  try {
    const formData = buildEntityFormData(data);

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/entities/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating entity:', error);
    throw error;
  }
}

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