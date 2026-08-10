'use client';

import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import LOVStepper from './LOVStepper';


const CustomNavMenu = () => {
  const theme = useTheme();

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
      <LOVStepper />
    </ColumnWrapper>
  );
};

export default CustomNavMenu;
