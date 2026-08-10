import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title/Title';

import useTitleDebtor from './TitleDebtor.hook';


const TitleDebtor = () => {
  const { handleRerouteViewPK } = useTitleDebtor();
  return (
    <RowWrapper sx={{ justifyContent: 'space-between' }}>
      <Title title="Informasi Customer" />
      <Button startIcon="monitoring" onClick={handleRerouteViewPK}>View Pengajuan Perikatan</Button>
    </RowWrapper>
  );
};

export default TitleDebtor;
