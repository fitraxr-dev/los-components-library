'use client';

import { useMemo, useCallback } from 'react';

import { ChevronRightRounded } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { getStepperConfig } from '@/configs/stepperConfig';
import useApp from '@/hooks/useApp';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import VaStepper from './VaStepper';


const CustomNavMenu = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const [user] = useApp();
  const config = getStepperConfig('parameter-va');

  const isMaker = useMemo(() => user.currentRole.includes(roles.MAKER), [user.currentRole]);

  // Check if user came from bucket list
  const isFromBucketList = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('maintenanceParameterVANavigation');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.source === 'bucket-list' && parsed.isViewOnly;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    return false;
  }, []);

  // Simple next step logic
  const currentStep = useMemo(() => {
    if (!config) return 0;
    for (let i = 0; i < config.stepPaths.length; i++) {
      if (pathname.includes(config.stepPaths[i])) {
        return i;
      }
    }
    return 0;
  }, [pathname, config]);

  const canGoNext = !isFromBucketList && config && currentStep < config.steps.length - 1;

  const goNext = useCallback(() => {
    if (!canGoNext || !config) return;
    // Simple navigation to next step
    const nextStep = currentStep + 1;
    if (nextStep < config.stepPaths.length) {
      const targetPath = config.stepPaths[nextStep];
      // You can add more sophisticated navigation logic here if needed
      window.location.href = pathname.replace(config.stepPaths[currentStep], targetPath);
    }
  }, [canGoNext, config, currentStep, pathname]);

  return (
    <ColumnWrapper
      sx={{
        background: 'rgba(163, 202, 233, 0.2)',
        borderRadius: theme.radius(1),
      }}
      px={theme.spacing(2)}
      py={theme.spacing(2)}
      display="flex"
      gap={theme.spacing(2)}
      boxShadow={6}
    >
      <RowWrapper alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
        <TextStyle
          variant="body2"
          color={theme.palette.primary.main}
          sx={{ fontWeight: 700 }}
        >
          Menu
        </TextStyle>
        {!isFromBucketList && (
          <IconButton
            size="small"
            color="primary"
            onClick={goNext}
            disabled={!canGoNext}
            sx={{ backgroundColor: 'custom.gray40', borderRadius: 2 }}
          >
            <ChevronRightRounded fontSize="small" />
          </IconButton>
        )}
      </RowWrapper>
      <VaStepper />
    </ColumnWrapper>
  );
};

export default CustomNavMenu;
