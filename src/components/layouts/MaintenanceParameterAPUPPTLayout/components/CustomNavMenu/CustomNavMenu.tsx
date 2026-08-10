'use client';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import APUPPTStepper from './APUPPTStepper';


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
      <APUPPTStepper />
    </ColumnWrapper>
  );
};

export default CustomNavMenu;
