import GeneralTheme from './generalTheme';


export const darkTheme = {
  ...GeneralTheme,
  palette: {
    custom: {
      grey: '#BCC8E7',
    },
    info: {
      main: '#66A3FF',
      soft: '#EAF2FF',
    },
    mode: 'dark',
    primary: {
      dark: '#06377B',
      main: '#0061A7',
    },
    secondary: {
      dark: '#808080',
      light: '#D0D0D0',
      main: '#A8A8A8',
    },
    success: {
      light: '#E7FFDC',
      main: '#75D37F',
    },
    warning: {
      light: '#FFE4E4',
      main: '#FF6F6F',
    },
  },
};
