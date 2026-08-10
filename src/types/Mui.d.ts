import {} from '@mui/material/styles';
import {} from '@mui/material/Button';
import {} from '@mui/material/CircularProgress';
import {} from '@mui/x-date-pickers';
import {} from '@mui/material/Typography';
import type { TextVariant } from '@/types/TextVariant';


declare module '@mui/material/styles' {
  interface Theme {
    radius: (val: number) => string | number;
  }
  interface ThemeOptions {
    radius: (val: number) => string | number;
  }

  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    title1: React.CSSProperties;
    title2: React.CSSProperties;
    buttonLarge: React.CSSProperties;
    button: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    body5: React.CSSProperties;
    body6: React.CSSProperties;
    body7: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    title1: React.CSSProperties;
    title2: React.CSSProperties;
    buttonLarge: React.CSSProperties;
    button: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    body5: React.CSSProperties;
    body6: React.CSSProperties;
    body7: React.CSSProperties;
  }

  interface Palette {
    white: Palette['primary'];
    disabled: Palette['primary'];
    orange?: Pallete['orange'];
    darkBlue?: Pallete['darkBlue'];
    errorOtp?: Pallete['errorOtp'];
    custom: CustomPallete;
  }
  interface PaletteOptions {
    white?: PaletteOptions['primary'];
    orange?: PalleteOptions['orange'];
    disabled?: PalleteOptions['primary'];
    darkBlue?: PalleteOptions['darkBlue'];
    errorOtp?: PalleteOptions['errorOtp'];
    custom?: CustomPallete;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    lightYellow: true;
    orange: true;
    darkBlue: true;
    blueRefina: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
    title1: true;
    title2: true;
    buttonLarge: true;
    button: true;
    body1: true;
    body2: true;
    body3: true;
    body4: true;
    body5: true;
    body6: true;
    body7: true;
  }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides {
    white: true;
  }
}

declare module '@mui/x-date-pickers/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.types' {
  interface PickersArrowSwitcherComponentsPropsOverrides {
    iconName?: string;
    textVariant?: TextVariant;
  }
}

declare module '@mui/x-date-pickers/PickersCalendarHeader/PickersCalendarHeader.types' {
  interface PickersCalendarHeaderComponentsPropsOverrides {
    iconName?: string;
    textVariant?: TextVariant;
  }
}

type CustomPallete = {
  pc10: string;
  pc20: string;
  pc50: string;
  pc80: string;
  background: string;
  yellow: string;
  lightYellow: string;
  red: string;
  softRed: string;
  green: string;
  softGreen: string;
  blue90: string;
  blue100: string;
  softBlue: string;
  blueGray: string;
  neutral10: string;
  text: string;
  gray10: string;
  gray20: string;
  gray30: string;
  gray40: string;
  gray50: string;
  gray60: string;
  chart10: string;
  chart20: string;
  chart30: string;
  chart40: string;
  chart50: string;
}
