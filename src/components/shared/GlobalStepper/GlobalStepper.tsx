'use client';

import { useTheme } from '@mui/material';

import { useGlobalStepper, type StepperConfig } from '@/hooks/useGlobalStepper';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


interface GlobalStepperProps {
  config: StepperConfig;
  sx?: Record<string, any>;
}

const GlobalStepper: React.FC<GlobalStepperProps> = ({ config, sx = {} }) => {
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
          disabled={false} // Can be made configurable
          isFull
        >
          {step}
        </Button>
      ))}
    </RowWrapper>
  );
};

export default GlobalStepper;
