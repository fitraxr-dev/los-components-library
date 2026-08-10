import React from 'react';

import { useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import type { TableFooterNestedProps } from './TableFooterNestes.types';


const TableFooterNested = ({
  sx,
  onClickLevel,
  onClickDelete,
  onClickRow,
  disabled = false,
  isShowBtnAddNewLevel,
}: TableFooterNestedProps) => {
  const theme = useTheme();

  return (
    <RowWrapper sx={{ ...sx, gap: 2, justifyContent: 'flex-end', justifyItems: 'flex-end', mr: 2, py: 2 }}>
      {isShowBtnAddNewLevel &&
      <Button
        variant="outlined"
        startIcon="add-2"
        startIconSx={{ fontSize: theme.spacing(3) }}
        sx={{
          height: theme.spacing(6),
          padding: theme.spacing(1),
        }}
        onClick={onClickLevel}
        disabled={disabled}
      >
        Add New Level
      </Button>}
      <Button
        variant="outlined"
        startIcon="delete"
        startIconSx={{ fontSize: theme.spacing(3), path: { stroke: 'red' } }}
        sx={{
          height: theme.spacing(6),
          padding: theme.spacing(1),
        }}
        onClick={onClickDelete}
        disabled={disabled}
      >
        Delete This Level
      </Button>
      <Button
        variant="outlined"
        startIcon="add-2"
        startIconSx={{ fontSize: theme.spacing(3) }}
        sx={{
          height: theme.spacing(6),
          padding: theme.spacing(1),
        }}
        onClick={onClickRow}
        disabled={disabled}
      >
        Add New Row
      </Button>
    </RowWrapper>
  );
};

export default TableFooterNested;
