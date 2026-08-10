'use client';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


const SaveButton = () => {
  const goToNextStep = useGoToNextStep();

  return (
    <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
      <Button onClick={() => goToNextStep()}>
        Next
      </Button>
    </RowWrapper>

  );
};


export default SaveButton;
