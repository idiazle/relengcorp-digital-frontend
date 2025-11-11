import axios from 'axios';

// Moncon Services - Notices CRUD Operations
// Base URL is set using environment variable NEXT_PUBLIC_API_URL

// Fetch all notices
export const getNotices = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon notices:', error);
    throw error;
  }
};

// Fetch a single notice by ID
export const getNoticeById = async (id) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon notice by ID:', error);
    throw error;
  }
}

// Create a new notice
export const createNotice = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notices`, data);
    return response;
  } catch (error) {
    console.error('Error creating Moncon notice:', error);
    throw error;
  }
}

// Update an existing notice
export const updateNotice = async (id, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating Moncon notice:', error);
    throw error;
  }
}

// // Partially update an existing notice
// export const patchNotice = async (id, data) => {
//   try {
//     const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`, data);
//     return response;
//   } catch (error) {
//     console.error('Error patching Moncon notice:', error);
//     throw error;
//   }
// }

// Delete a notice
export const deleteNotice = async (id) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting Moncon notice:', error);
    throw error;
  }
}



//REPORTS
export const getMonconReports = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon reports:', error);
    throw error;
  }
}

export const createMonconReport = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reports`, data);
    return response;
  } catch (error) {
    console.error('Error creating Moncon report:', error);
    throw error;
  }
}

export const deleteMonconReport = async (id) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting Moncon report:', error);
    throw error;
  }
}

//
export const getNoticesByReportId = async (reportId) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices-by-report/${reportId}`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon notices by report ID:', error);
    throw error;
  }
}

export const updateReport = async (reportId, data ) =>{
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`, data);
    return response;
  } catch (error) {
    console.error('Error update Moncon report:', error);
    throw error;
  }
}