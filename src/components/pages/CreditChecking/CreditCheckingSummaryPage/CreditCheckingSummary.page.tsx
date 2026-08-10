'use client';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import DigitalMemo from './components/DigitalMemo';
import Disclaimer from './components/Disclaimer';


const CreditCheckingSummary = () => {

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title title="Credit Checking Summary" />
        <Input type="dropdown" dropdownList={[]} containerSx={{ width: '30%' }} />
      </RowWrapper>

      <Disclaimer />
      <DigitalMemo />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button>
          Save & Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default CreditCheckingSummary;
