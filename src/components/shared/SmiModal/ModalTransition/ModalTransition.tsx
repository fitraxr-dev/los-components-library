'use client';
import { forwardRef } from 'react';

import { Slide } from '@mui/material';

import type { SlideProps } from '@mui/material';


const ModalTransition = forwardRef(function ModalTransition(props: SlideProps, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default ModalTransition;
