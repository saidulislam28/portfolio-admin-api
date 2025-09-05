import axios from 'axios';

const API_BASE_URL = 'https://your-api-endpoint.com/api';

export const getRegistrationContent = async () => {
  
  return [];
    try {
    const response = await axios.get(`${API_BASE_URL}/registration-content`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitRegistration = async (data) => {
  try {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(data).forEach(key => {
      if (key === 'passportFile' && data[key]) {
        formData.append(key, {
          uri: data[key].uri,
          name: data[key].name,
          type: data[key].type
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};