'use client';

import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import { getStepperConfig } from '@/configs/stepperConfig';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import { useBarStepper } from './useBarStepper';


interface BarStepperProps {
  sx?: Record<string, any>;
}

const BarStepper: React.FC<BarStepperProps> = ({ sx = {} }) => {
  const theme = useTheme();
  const config = getStepperConfig('parameter-mapping-bar');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const {
    currentStep,
    handleStepClick,
    isStepActive,
    isStepCompleted,
    steps,
  } = useBarStepper(config);

  // Get navigation data from sessionStorage
  const [isBucketListDetail, setIsBucketListDetail] = useState(false);
  const [navigationContext, setNavigationContext] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('maintenanceParameterBarNavigation');
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

  // Determine if step should be disabled
  const isStepDisabled = (stepIndex: number) => {
    // If this is a bucket list detail view, disable Summary (index 1) and Validasi (index 2)
    if (isBucketListDetail) {
      return stepIndex === 1 || stepIndex === 2; // Disable Summary and Validasi steps
    }
    return false;
  };

  // Determine if step should be hidden
  const isStepHidden = (stepIndex: number) => {
    // If checker from approval-list and not viewOnly (WAITING_APPROVAL_CHECKER), hide Process step
    if (isChecker && navigationContext?.source === 'approval-list' && !navigationContext?.isViewOnly) {
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

export default BarStepper;
