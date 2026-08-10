'use client';

import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


const SaveButton = () => {
  const { goToNextStep } = useESDDContext();

  function handleSaveAndNext() {
    goToNextStep();
  }

  return (
    <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
      <Button onClick={() => handleSaveAndNext()}>
        Next
      </Button>
    </RowWrapper>

  );
};


export default SaveButton;
