'use client';
import { useEffect, useRef } from 'react';

import { Box, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { addAlphaToHex } from '@/helpers/colors';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import Progress from '../../../../../../src/components/shared/Progress';


const StepperV2 = ({
  module,
  process,
  id = undefined,
  customProgress,
  action,
  flow,
}: SmiComponentProps & { action?: string; flow?: string }) => {
  const [_, dispatch] = useApp();
  const { processId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const containerRef = useRef(null);
  const path = usePathname();
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const router = useCustomRouter();
  const theme = useTheme();

  const lastPath = getLastPath(path);

  const { data: bucketStepperData } = useGetBucketStepper({
    bucketProcessId: String(id ?? processId),
    module,
    process,
  });
  const { steps, progress } = bucketStepperData;

  useEffect(() => {
    const viewOnly = !steps.find((step) => step.urlPath === lastPath)?.enable;

    ref?.current?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'center',
    });

    dispatch({
      data: bucketStepperData,
      type: reducer.SET_STEPPER,
    });

    setViewOnly(viewOnly);

  }, [path, bucketStepperData]);

  function normalizeStepPath(stepPath: string) {
    if (stepPath === 'maintenance-template-reminder') {
      return 'maintenance-reminder';
    }
    return stepPath;
  }

  function handleClickStepper(lastPath: string, viewOnly: boolean) {
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
    const segments: string[] = path.split('/');
    const baseSegments = segments.slice(0, -1);

    // normalisasi path dari API
    const normalizedPath = normalizeStepPath(lastPath);

    const basePath: string = `${baseSegments.join('/')}/${normalizedPath}`;
    const newPath = replacePath(basePath, {});

    let query = [];

    if (action) {
      query.push(`action=${action}`);
    }

    if (flow) {
      query.push(`flow=${flow}`);
    }

    const finalPath = query.length > 0 ? `${newPath}?${query.join('&')}` : newPath;

    router.push(finalPath);
    setViewOnly(viewOnly);
  };

  const currentStepIndex = steps.findIndex((step) => matchesPathname(lastPath, step.urlPath));

  function handlePrevStep() {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      handleClickStepper(prevStep.urlPath, !prevStep.enable);
    }
  }

  function handleNextStep() {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      handleClickStepper(nextStep.urlPath, !nextStep.enable);
    }
  }

  if (!steps.length) return null;

  function handleHorizantalScroll(step: number) {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      containerRef.current.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= 100) {
        clearInterval(slideTimer);
      }
    }, 25);
  };

  let justify = steps.length <= 5 ? 'center' : 'left';

  return (
    <>
      <RowWrapper sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            '&:hover': {
              backgroundColor: currentStepIndex > 0 ? theme.palette.custom.gray50 : undefined,
            },
            alignItems: 'center',
            cursor: currentStepIndex > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            height: '100%',
            mx: theme.spacing(2),
            opacity: currentStepIndex > 0 ? 1 : 0.5,
          }}
          onClick={handlePrevStep}
        >
          <Icon
            iconName="chevron-left"
            sx={{ fontSize: '2vw' }}
          />
        </Box>
        <Box
          ref={containerRef}
          sx={{
            '::-webkit-scrollbar': {
              display: 'none',
            },
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            gap: 3,
            justifyContent: justify,
            maxWidth: '100%',
            'msOverflowStyle': 'none',
            overflow: 'scroll',
            'scrollbarWidth': 'none',
          }}
        >
          {
            steps.map((step, index) => {
              const stepIcon =
                (matchesPathname(lastPath, step.urlPath) && step.enable) ? 'stepper-selected-blue' :
                  (matchesPathname(lastPath, step.urlPath) && !step.enable) ? 'stepper-selected-gray' :
                    (step.enable && step.isDone) ? 'stepper-dot-blue' :
                      (step.enable && !step.isDone) ? 'stepper-border-blue' :
                        (!step.enable && step.isDone) ? 'stepper-dot-gray' :
                          'stepper-border-gray';

              return (
                <Box key={index} ref={matchesPathname(lastPath, step.urlPath) ? ref : null}>
                  <ColumnWrapper
                    onClick={() => handleClickStepper(step.urlPath, !step.enable)}
                    sx={{
                      '&:hover': {
                        backgroundColor:
                          step.enable
                            ? addAlphaToHex(theme.palette.primary.main, 0.075)
                            : undefined,
                        cursor: 'pointer',

                      },
                      alignItems: 'center',
                      borderBottom: '0.1vw solid',
                      borderColor:
                        matchesPathname(lastPath, step.urlPath)
                          ? theme.palette.primary.main
                          : theme.palette.common.white,
                      maxWidth: '10.42vw',
                      minWidth: '10.42vw',
                      padding: theme.spacing(1),
                    }}
                  >
                    <Icon
                      iconName={stepIcon}
                      sx={{
                        fontSize: '2.1vw',
                        mb: theme.spacing(2),
                      }}
                    />
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={
                        step.enable
                          ? theme.palette.primary.main
                          : theme.palette.disabled.main
                      }
                      sx={{ textAlign: 'center' }}
                    >
                      {step.label}
                    </TextStyle>
                  </ColumnWrapper>
                </Box>
              );
            })
          }
        </Box>
        <Box
          sx={{
            '&:hover': {
              backgroundColor: currentStepIndex < steps.length - 1 ? theme.palette.custom.gray50 : undefined,
            },
            alignItems: 'center',
            cursor: currentStepIndex < steps.length - 1 ? 'pointer' : 'not-allowed',
            display: 'flex',
            height: '100%',
            mx: theme.spacing(2),
            opacity: currentStepIndex < steps.length - 1 ? 1 : 0.5,
          }}
          onClick={handleNextStep}
        >
          <Icon
            iconName="chevron-right"
            sx={{ fontSize: '2vw' }}
          />
        </Box>
      </RowWrapper>
      <Progress percentage={customProgress !== undefined ? customProgress : progress} />
    </>
  );
};

export default StepperV2;
