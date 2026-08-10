import fetch from '@/helpers/fetch';


const getUrl = () => '/api/auth/logout';

const logout = async () => {
  const url = getUrl();
  try {
    const response: any = await fetch.get(url);
    return response.data;
  } catch (error) {
    // Log error to logger, then rethrow error
    throw error.response.data;
  }
};

export default logout;
