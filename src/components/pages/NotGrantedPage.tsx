'use client';
import Button from '@/components/shared/Button';
import VStack from '@/components/shared/VStack';


const NotGrantedPage = () => {

  return (
    <VStack justify="center" align="center">
      <h3>Tidak berhak akses</h3>
      <Button onClick={() => window.history.back()}>Kembali</Button>
    </VStack>
  );
};

export default NotGrantedPage;
