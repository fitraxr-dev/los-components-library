import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  useTheme,
} from '@mui/material';
import { Document, Page } from 'react-pdf';

import OverlayImage from '@/components/shared/Overlay/OverlayImage';
import OverlayPdf from '@/components/shared/Overlay/OverlayPdf';

import { useOverlayApiContext, useOverlayContext } from '../../OverlayLayout/Overlay.context';

import type { AllowedOverlayTypes } from '../../OverlayLayout/Overlay.context';


const Overlay: React.FC = () => {
  const { isOpen, url, type } = useOverlayContext();
  const { setIsOpen, setType } = useOverlayApiContext();
  const theme = useTheme();
  const [numPages, setNumPages] = useState<number>();
  const [visiblePages, setVisiblePages] = useState<number[]>([1, 2, 3, 4, 5]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function documentComponent(url: string, type: AllowedOverlayTypes) {
    switch (type) {
      case 'pdf':
        return <OverlayPdf url={url} />;
      case 'image':
        return <OverlayImage url={url} />;
      default:
        return null;
    }
  }
  console.log('isOpen', isOpen);
  return (
    <>
      <Dialog
        onClose={(event: object, reason: string) => setIsOpen(false)}
        scroll="body"
        open={isOpen}
        maxWidth={false}
        PaperProps={{
          sx: { backgroundColor: 'transparent',
            margin: '0',
          // maxWidth: 'calc(80% - 64px)'
          } }}
      >
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{ left: '95%', position: 'fixed', top: '0%' }}
        >
          <CloseIcon color="error" />
        </IconButton>
        {url &&
            documentComponent(url, type)
        }
      </Dialog>
    </>
  );
};

export default Overlay;
