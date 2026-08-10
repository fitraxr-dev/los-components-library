'use client';

import { useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import { useGlobalStepper } from '../../hooks/useGlobalStepper';


interface GlobalStepperProps {
  config: {
    steps: string[];
    stepPaths: string[];
    baseUrl: string;
  };
  sx?: Record<string, any>;
  disabledSteps?: number[]; // Array of step indices that should be disabled
}

const GlobalStepper: React.FC<GlobalStepperProps> = ({ config, sx = {}, disabledSteps = []}) => {
  const theme = useTheme();
  const {
    currentStep,
    handleStepClick,
    isStepActive,
    isStepCompleted,
    steps,
  } = useGlobalStepper(config);

  return (
    <RowWrapper justifyContent="space-between" sx={{ gap: theme.spacing(2), ...sx }}>
      {steps.map((step, index) => (
        <Button
          key={index}
          variant={isStepActive(index) ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleStepClick(index)}
          disabled={disabledSteps.includes(index)}
          isFull
        >
          {step}
        </Button>
      ))}
    </RowWrapper>
  );
};

export default GlobalStepper;
