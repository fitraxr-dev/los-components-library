import fetch from '@/helpers/fetch';


function getUrl() {
  return 'https://jsonplaceholder.typicode.com/users/3';
}

export default async function getUser() {
  const url = getUrl();
  try {
    const response = await fetch.get(url);
    return response.data;
  } catch (error) {
    // Log error to logger, then rethrow error
    throw error;
  }
}
