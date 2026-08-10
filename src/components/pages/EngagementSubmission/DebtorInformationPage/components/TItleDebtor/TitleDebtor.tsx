import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title/Title';

import useTitleDebtor from './TitleDebtor.hook';


const TitleDebtor = () => {
  const { handleRerouteViewSPFP } = useTitleDebtor();

  return (
    <RowWrapper sx={{ justifyContent: 'space-between' }}>
      <Title title="Informasi Customer" />
      <Button startIcon="monitor" onClick={handleRerouteViewSPFP}>View SPFP Final</Button>
    </RowWrapper>
  );
};

export default TitleDebtor;
