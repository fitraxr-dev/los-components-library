import localFont from 'next/font/local';


export const poppins = localFont({
  src: [
    {
      path: 'fonts/Poppins-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
    {
      path: 'fonts/Poppins-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: 'fonts/Poppins-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: 'fonts/Poppins-Regular.ttf',
      style: 'bold',
      weight: '400',
    },
    {
      path: 'fonts/Poppins-Light.ttf',
      style: 'normal',
      weight: 'normal',
    },
  ],
});

const generalTheme = {
  breakpoints: {
    values: {
      desktopL: 1920,
      desktopM: 1360,
      desktopS: 1024,
      desktopXL: 2560,
      desktopXXL: 3840,
      lg: 1200,
      md: 900,
      min: 0,
      sm: 600,
      xl: 1536,
      xs: 250,
    },
  },
  radius: (factor) => `${(10 * 100 * factor) / 1920}vw`,
  shadows: [
    'none',
    '0px 0.625vw 2.6vw 0px rgba(112, 126, 164, 0.1)',
    '0px 0.1041666667vw 0.2604166667vw 0px rgba(38, 51, 77, 0.1)',
    ...Array(22).fill(
      '0px 0.1041666667vw 0.2604166667vw 0px rgba(38, 51, 77, 0.1)',
    ),
  ],
  spacing: (factor) => `${(8 * 100 * factor) / 1920}vw`,
  typography: {
    body1: {
      fontSize: '1.25vw',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    body2: {
      fontSize: '1.1458333333vw',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    body3: {
      fontSize: '1.04166666667vw',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body4: {
      fontSize: '0.9375vw',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body5: {
      fontSize: '0.8333333333vw',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body6: {
      fontSize: '0.7291666667vw',
      fontWeight: 300,
      lineHeight: 1.2,
    },
    body7: {
      fontSize: '0.625vw',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    button: {
      fontSize: '0.9375vw',
      fontWeight: 600,
      letterSpacing: '0.04688vw',
      lineHeight: '1',
      textTransform: 'none',
    },
    buttonLarge: {
      fontSize: '1.0417vw',
      fontWeight: 700,
      letterSpacing: '0.10417vw',
      lineHeight: 1.2,
    },
    caption: {
      fontSize: '0.225vw',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    display1: {
      fontSize: '2.08333333333vw',
      fontWeight: 700,
      letterSpacing: '0.1052vw',
      lineHeight: 1.2,
    },
    display2: {
      fontSize: '1.66667vw',
      fontWeight: 700,
      letterSpacing: '0.083vw',
      lineHeight: 1.2,
    },
    fontFamily: [`${poppins.style.fontFamily}`, 'sans-serif'].join(','),
    title1: {
      fontSize: '1.302vw',
      fontWeight: 400,
      letterSpacing: '0.065vw',
      lineHeight: 1.2,
    },
    title2: {
      fontSize: '1.0417vw',
      fontWeight: 400,
      letterSpacing: '0.052vw',
      lineHeight: 1.2,
    },
  },
};

export default generalTheme;
