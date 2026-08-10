import { useTheme } from '@mui/material';


const useStyle = () => {
  const theme = useTheme();

  const styDropdown = {
    '.MuiSelect-select': {
      minHeight: '0px !important',
    },
    maxWidth: '5vw',
    mr: theme.spacing(1),
  };

  return {
    styDropdown,
  };
};

export default useStyle;
