'use client';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import VStack from '@/components/shared/VStack';


const NotFoundPage = () => {
  const router = useCustomRouter();

  return (
    <VStack padding="0 20px">
      <h2>Not Found Page</h2>
      <p>Could not find requested resource</p>
      <Button onClick={() => router.push('/')}>Go Home</Button>
    </VStack>
  );
};

export default NotFoundPage;
