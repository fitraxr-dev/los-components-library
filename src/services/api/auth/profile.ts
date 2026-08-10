import fetch from '@/helpers/fetch';


const getUrl = () => '/api/auth/profile';

const profile = async (body) => {
  const url = getUrl();
  try {
    const response: any = await fetch.post(url, body);
    return response.data;
  } catch (error) {
    // Log error to logger, then rethrow error
    throw error.response.data;
  }
};

export default profile;
