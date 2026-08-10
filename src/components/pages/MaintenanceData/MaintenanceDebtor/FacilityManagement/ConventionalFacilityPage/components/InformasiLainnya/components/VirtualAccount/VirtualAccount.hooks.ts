import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';


export const useVirtualAccount = () => {
  const theme = useTheme();

  const { control, watch } = useForm();
  return {
    control,
    theme,
    watch,
  };
};
