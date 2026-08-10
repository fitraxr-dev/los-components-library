'use client';

import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { getStepperConfig } from '@/configs/stepperConfig';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import { useVAStepper } from './useVAStepper';


interface VaStepperProps {
  sx?: Record<string, any>;
}

const VaStepper: React.FC<VaStepperProps> = ({ sx = {} }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const config = getStepperConfig('parameter-va');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const {
    currentStep,
    handleStepClick,
    isStepActive,
    isStepCompleted,
    steps,
  } = useVAStepper(config);

  // Get navigation data from sessionStorage
  const [isFromBucketList, setIsFromBucketList] = useState(false);
  const [navigationContext, setNavigationContext] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('maintenanceParameterVANavigation');
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsFromBucketList(parsed.source === 'bucket-list' && parsed.isViewOnly);
          setNavigationContext(parsed);
        }
      } catch (error) {
        console.warn('Failed to parse navigation data:', error);
      }
    }
  }, []);

  // Determine if step should be disabled
  const isStepDisabled = (stepIndex: number) => {
    // Check if we're in create mode
    const isCreateMode = pathname.includes('/create/');

    // If this is create mode, don't disable any steps
    if (isCreateMode) {
      return false;
    }

    // If this is from bucket list, disable Summary and Validasi steps
    if (isFromBucketList) {
      const stepName = steps[stepIndex]?.toLowerCase();
      return stepName?.includes('summary') || stepName?.includes('validasi');
    }
    return false;
  };

  // Determine if step should be hidden
  const isStepHidden = (stepIndex: number) => {
    // If checker from approval-list and not viewOnly (WAITING_APPROVAL_CHECKER), hide Process step
    if (isChecker && navigationContext?.source === 'approval-list' && !navigationContext?.isViewOnly) {
      const stepName = steps[stepIndex]?.toLowerCase();
      return stepName?.includes('process');
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

export default VaStepper;
