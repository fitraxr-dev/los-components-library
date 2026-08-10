'use client';

import useGoToNextStep from '@/hooks/useGoToNextStep';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


const SaveButton = () => {
  const goToNextStep = useGoToNextStep();

  function handleNext() {
    goToNextStep();
  }

  return (
    <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
      <Button onClick={() => handleNext()}>
        Next
      </Button>
    </RowWrapper>

  );
};


export default SaveButton;
