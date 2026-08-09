import axios from 'axios';

export const getNotices = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon notices:', error);
    throw error;
  }
};

export const getNoticeById = async (id) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon notice by ID:', error);
    throw error;
  }
}

export const createNotice = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notices`, data);
    return response;
  } catch (error) {
    console.error('Error creating Moncon notice:', error);
    throw error;
  }
}

export const updateNotice = async (id, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating Moncon notice:', error);
    throw error;
  }
}

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
export const getAllReports = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
    return response;
  } catch (error) {
    console.error('Error fetching Moncon reports:', error);
    throw error;
  }
}

export const getMonconReports = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      params: {
        page,
        page_size: limit
      }
    });
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

export const updateReport = async (reportId, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`, data);
    return response;
  } catch (error) {
    console.error('Error update Moncon report:', error);
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

