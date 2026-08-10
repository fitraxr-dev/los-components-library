import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface CustomStepperProps {
  menuList: Array<{
    label: string;
    url: string;
  }>;
  onClick: (url: string) => void;
}

const CustomStepper = ({ menuList, onClick }: CustomStepperProps) => {
  const theme = useTheme();
  const path = usePathname();
  const menuActive = getLastPath(path);

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
      <TextStyle
        variant="body2"
        color={theme.palette.primary.main}
        sx={{ fontWeight: 700 }}
      >
        Menu
      </TextStyle>
      <RowWrapper justifyContent="space-between">
        {menuList?.map((val, index) => {
          return (
            <Box width="49%" key={index}>
              <Button
                onClick={val?.url !== menuActive ? () => {
                  onClick(val?.url);
                }
                  : () => {}}
                isFull
                variant={
                  val?.url === menuActive ? 'contained' : 'outlined'
                }
              >
                {val?.label}
              </Button>
            </Box>
          );
        })}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default CustomStepper;
