import { useState } from 'react';

import { Box, CircularProgress, useTheme } from '@mui/material';
import { Document, Page } from 'react-pdf';

import type { PdfProps } from './types';


const OverlayPdf = ({ url }: PdfProps) => {

  const theme = useTheme();
  const [numPages, setNumPages] = useState<number>();
  //TODO: LAZY LOAD PAGES
  const [visiblePages, setVisiblePages] = useState<number[]>([1, 2, 3, 4, 5]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (

    <Box
      sx={{
        alignItems: 'flex-end',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        // overflowY: 'scroll',
        padding: 2,
        // position: 'fixed',
        top: 0,
        // width: '100vw',
        zIndex: 99999999,
      }}
    >
      <Box
        sx={{ display: 'flex',
          flex: 1,
          justifyContent: 'center',
        //   marginTop: '2vw',
        // maxHeight: '100vh'
        }}
      >
        <Document
          file={url}
          onLoadProgress={({ loaded, total }) => console.log('Loading a document: ' + (loaded / total) * 100 + '%')}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Box sx={{ alignItems: 'center', display: 'flex', height: '100vh', justifyContent: 'center', width: '100%' }}>
              <CircularProgress color="primary" />
            </Box>
          }
        >
          {/* <Page pageNumber={pageNumber} /> */}
          {/* Change `max-h-` as needed. */}
          {numPages &&
              Array.from({ length: numPages }, (_, index) => index + 1).map(
                (pageNumber) => true ?
                  <Box
                    key={`index${pageNumber}`}
                    sx={{ marginBottom: theme.spacing(1.5) }
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      loading={
                        <CircularProgress color="primary" />
                      }
                    />
                  </Box>
                  : null
              )}
        </Document>
      </Box>
    </Box>
  );
};

export default OverlayPdf;
