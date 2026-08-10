import React from 'react';

import { useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import type { TableFooterProps } from './TableFooter.types';


const TableFooter = ({ title = 'Add New', sx, onClick, disabled = false }: TableFooterProps) => {
  const theme = useTheme();

  return (
    <RowWrapper sx={{ ...sx, justifyContent: 'end', mb: 2 }}>
      <Button
        variant="outlined"
        startIcon="add-2"
        startIconSx={{ fontSize: theme.spacing(3) }}
        sx={{
          height: theme.spacing(6),
          padding: theme.spacing(1),
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {title}
      </Button>
    </RowWrapper>
  );
};

export default TableFooter;
