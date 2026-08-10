'use client';
import * as React from 'react';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import type { LoaderProps } from './types';


const Loader = ({ isLoading = false }: LoaderProps) => (
  <Dialog
    open={isLoading}
    PaperProps={{
      style: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }}
  >
    <DialogContent>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </DialogContent>
  </Dialog>
);

export default Loader;
