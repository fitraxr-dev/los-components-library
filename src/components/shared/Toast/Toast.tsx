import { useMemo } from 'react';

import { Card, useTheme } from '@mui/material';


import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { ToastProps } from './types';


const Toast = ({ severity }: ToastProps) => {
  const theme = useTheme();

  const toastStatus = useMemo(() => {
    switch (severity) {
      case 'success':
        return {
          description: 'Data anda berhasil disimpan',
          iconName: 'status-success',
          text: 'Saved Successfully',
        };
      case 'success-delete':
        return {
          description: 'Data anda berhasil dihapus',
          iconName: 'status-success',
          text: 'Deleted Successfully',
        };
      case 'error':
        return {
          description: 'Data anda gagal disimpan',
          iconName: 'status-error',
          text: 'Saved Failed',
        };
      case 'error-delete':
        return {
          description: 'Data anda gagal dihapus',
          iconName: 'status-error',
          text: 'Delete Failed',
        };
      case 'warning':
        return {
          description: 'Data Anda tidak valid',
          iconName: 'status-warning',
          text: 'Warning',
        };
      default:
        return {
          description: 'Data anda gagal disimpan',
          iconName: 'status-error',
          text: 'Saved Failed',
        };
    }
  }, [severity]);

  return (
    <Card
      sx={{
        alignItems: 'center',
        backgroundColor: theme.palette.custom.blue100,
        display: 'flex',
        gap: theme.spacing(1),
        minWidth: theme.spacing(40),
        padding: theme.spacing(2),
      }}
    >
      <Icon
        iconName={toastStatus.iconName}
        sx={{
          fontSize: theme.spacing(6),
        }}
      />
      <VStack>
        <TextStyle
          color={theme.palette.white.main}
          variant="body4"
          weight={600}
        >
          {toastStatus.text}
        </TextStyle>
        <TextStyle
          variant="body5"
          color={theme.palette.custom.gray30}
          weight={400}
        >
          {toastStatus.description}
        </TextStyle>
      </VStack>
    </Card>
  );
};

export default Toast;
