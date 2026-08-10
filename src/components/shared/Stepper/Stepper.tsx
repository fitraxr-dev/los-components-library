'use client';
import { useEffect, useRef } from 'react';

import { Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { addAlphaToHex } from '@/helpers/colors';
import { getLastPath, matchesPathname } from '@/helpers/navigation';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { StepperProps } from './Stepper.types';


const Stepper = ({
  steps = [],
  onClick,
}: StepperProps) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const ref = useRef(null);
  const path = usePathname();
  const activePath = getLastPath(path);

  useEffect(() => {
    ref?.current?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'center',
    });
  }, [path]);

  function handleOnClick(url: string, enable: boolean) {
    if (!matchesPathname(activePath, url)) {
      onClick(url, !enable);
    };
  };

  if (!steps.length) return null;

  const handleHorizantalScroll = (step: number) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      containerRef.current.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= 100) {
        clearInterval(slideTimer);
      }
      // if (element.scrollLeft === 0) {
      //   setIsLeftDisabled(true);
      // } else {
      //   setIsRightDisabled(false);
      // }
    }, 25);
  };

  let justify = steps.length <= 5 ? 'center' : 'left';

  return (
    <RowWrapper sx={{ alignItems: 'center' }}>
      <Box
        sx= {{
          '&:hover': {
            backgroundColor: theme.palette.custom.gray50,
          },
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          height: '100%',
          mx: theme.spacing(2),
        }}
        onClick={() => handleHorizantalScroll(-20)}
      >
        <Icon
          iconName="chevron-left"
          sx={{ fontSize: '2vw' }}
        />
      </Box>
      <Box
        ref={containerRef}
        sx={{
          // '*:first-child': {
          //   mx: 'auto',
          // },
          // '*:last-child': {
          //   mx: 'auto',
          // },
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
            (matchesPathname(activePath, step.urlPath) && step.enable) ? 'stepper-selected-blue' :
              (matchesPathname(activePath, step.urlPath) && !step.enable) ? 'stepper-selected-gray' :
                (step.enable && step.isDone) ? 'stepper-dot-blue' :
                  (step.enable && !step.isDone) ? 'stepper-border-blue' :
                    (!step.enable && step.isDone) ? 'stepper-dot-gray' :
                      'stepper-border-gray';

            return (
              <Box key={index} ref={matchesPathname(activePath, step.urlPath) ? ref : null} >
                <ColumnWrapper
                  onClick={() => handleOnClick(step.urlPath, step.enable)}
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
                    matchesPathname(activePath, step.urlPath)
                      ? theme.palette.primary.main
                      : theme.palette.common.white,
                    justifyContent: 'center',
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
                    sx={{
                      textAlign: 'center',

                    }}
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
        sx= {{
          '&:hover': {
            backgroundColor: theme.palette.custom.gray50,
          },
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          height: '100%',
          mx: theme.spacing(2),
        }}
        onClick={() => handleHorizantalScroll(20)}
      >
        <Icon
          iconName="chevron-right"
          sx={{ fontSize: '2vw' }}
        />
      </Box>
    </RowWrapper>
  );
};

export default Stepper;
