import fetch from '@/helpers/fetch';


const getUrl = () => '/api/auth/login/validate/session';

const validateSession = async (body) => {
  const url = getUrl();
  try {
    const response: any = await fetch.post(url, body);
    return response.data;
  } catch (error) {
    // Log error to logger, then rethrow error
    throw error.response.data;
  }
};

export default validateSession;
