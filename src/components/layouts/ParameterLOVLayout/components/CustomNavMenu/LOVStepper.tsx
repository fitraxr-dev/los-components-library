'use client';

import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import { getStepperConfig } from '@/configs/stepperConfig';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import { useLOVStepper } from './useLOVStepper';


interface LOVStepperProps {
  sx?: Record<string, any>;
}

const LOVStepper: React.FC<LOVStepperProps> = ({ sx = {} }) => {
  const theme = useTheme();
  const config = getStepperConfig('maintenance-parameter');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const {
    currentStep,
    handleStepClick,
    isStepActive,
    isStepCompleted,
    steps,
  } = useLOVStepper(config);

  // Get navigation data from sessionStorage
  const [isBucketListDetail, setIsBucketListDetail] = useState(false);
  const [navigationContext, setNavigationContext] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('maintenanceParameterNavigation');
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsBucketListDetail(parsed.isBucketListDetail || false);
          setNavigationContext(parsed);
        }
      } catch (error) {
        console.warn('Failed to parse navigation data:', error);
      }
    }
  }, []);

  // Determine if step should be disabled or hidden
  const isStepDisabled = (stepIndex: number) => {
    // If this is a bucket list detail view, disable Summary (index 1) and Validasi (index 2)
    if (isBucketListDetail) {
      return stepIndex > 0; // Disable all steps except Process (index 0)
    }
    return false;
  };

  // Determine if step should be hidden
  const isStepHidden = (stepIndex: number) => {
    // If checker with WAITING_APPROVAL_CHECKER status, hide Process step (index 0)
    if (isChecker && navigationContext?.status === 'WAITING_APPROVAL_CHECKER') {
      return stepIndex === 0; // Hide Process step
    }
    return false;
  };

  if (!config) {
    return null;
  }

  return (
    <RowWrapper justifyContent="space-between" sx={{ gap: theme.spacing(2), ...sx }}>
      {steps.map((step, index) => {
        // Skip rendering if step should be hidden
        if (isStepHidden(index)) {
          return null;
        }

        return (
          <Button
            key={index}
            variant={isStepActive(index) ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleStepClick(index)}
            disabled={isStepDisabled(index)}
            isFull
          >
            {step}
          </Button>
        );
      })}
    </RowWrapper>
  );
};

export default LOVStepper;
