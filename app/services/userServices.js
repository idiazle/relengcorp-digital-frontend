import axios from 'axios';

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch a single user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

// Create a new user
export const createUser = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, data);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update an existing user
export const updateUser = async (id, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// // Partially update an existing user
// export const patchUser = async (id, data) => {
//   try {
//     const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, data);
//     return response;
//   } catch (error) {
//     console.error('Error patching user:', error);
//     throw error;
//   }
// }

// Delete an existing user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};