import React from 'react';

import { useTheme } from '@mui/material';

import Button from '../Button';
import RowWrapper from '../RowWrapper';


const TableAddFooter = ({ onClick }: { onClick: () => void }) => {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      startIcon="add-2"
      startIconSx={{ fontSize: theme.spacing(3) }}
      sx={{
        height: theme.spacing(6),
        padding: theme.spacing(1),
      }}
      onClick={onClick}
    >
      Add New
    </Button>
  );
};

export default TableAddFooter;
