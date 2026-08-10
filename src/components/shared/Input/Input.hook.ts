import { useTheme } from '@mui/material';


const useInput = (color = '') => {
  const theme = useTheme();

  let style = {
    '.Mui-disabled': {
      cursor: 'default',
    },
    '.MuiFormHelperText-root': {
      fontSize: theme.typography.body7.fontSize,
      fontWeight: 500,
      marginLeft: 0,
      marginTop: theme.spacing(1),
    },
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: `${theme.spacing(2)} !important`,
      ...theme.typography.body4,
      fontWeight: 500,
    },
    '.MuiInputBase-readOnly': {
      cursor: 'default',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(1),
    },
    borderRadius: theme.radius(1),
    flex: 1,
  };

  if (color) {
    style = {
      ...style,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: color,
        },
        '&.Mui-focused fieldset': {
          borderColor: color,
        },
        '&:hover fieldset': {
          borderColor: color,
        },
      },
      '& input': {
        color,
      },
      '.MuiFormHelperText-root': {
        ...style['.MuiFormHelperText-root'],
        color,
      },
      '.MuiInputBase-input': {
        ...style['.MuiInputBase-input'],
        color,
      },
      '.MuiOutlinedInput-notchedOutline': {
        ...style['.MuiOutlinedInput-notchedOutline'],
        borderColor: color,
      },

      '.MuiOutlinedInput-root:hover': {
        borderColor: color,
      },
      '.MuiSelect-icon': {
        ...style['.MuiSelect-icon'],
        color,
      },
    };

  }

  const styInputPassword = {
    color: 'red',
  };

  return {
    styInputPassword,
    style,
    theme,
  };
};

export default useInput;
