'use client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createPortal } from 'react-dom';

import { ColorContext } from '@/contexts/ColorContext';

import { OverlayProvider } from '../OverlayLayout/Overlay.context';

import ModalPortal from './components/ModalPortal';
import Overlay from './components/Overlay';
import RenderPage from './components/RenderPage/RenderPage';
import useMUI from './MUI.hook';


const MUILayout = ({ children }) => {
  const { colorMode, theme } = useMUI();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <ColorContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <OverlayProvider>
            <CssBaseline enableColorScheme />
            <ModalPortal />
            {createPortal(<Overlay />, document.body)}
            <RenderPage page={children} />
          </OverlayProvider>
        </ThemeProvider>
      </ColorContext.Provider>
    </LocalizationProvider>
  );
};

export default MUILayout;
