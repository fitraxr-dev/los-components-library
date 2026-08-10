'use client';
import { removeCookie } from '@/helpers/cookie';

import Button from '@/components/shared/Button';
import VStack from '@/components/shared/VStack';


const ErrorPage = () => {
  const handleResetCookie = () => {
    removeCookie('token');
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <VStack padding="0 20px">
      <h2>Error Page 123</h2>
      <Button onClick={() => handleResetCookie()}>Clear cookie</Button>
    </VStack>
  );
};

export default ErrorPage;
