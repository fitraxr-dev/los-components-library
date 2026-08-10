import React from 'react';

import { MenuItem, Pagination as PaginationBase, Select, useTheme } from '@mui/material';


import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { PaginationProps } from './types';


const Pagination = ({
  totalPage = 10,
  currentPage = 1,
  handlePageChange = () => { },
  pageSize = 5,
  setPageSize = () => { },
  pageSizeOptions = [5, 10, 25, 50, 100],
}: PaginationProps) => {
  const theme = useTheme();


  return (
    <RowWrapper
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
      }}
    >
      <RowWrapper sx={{ alignItems: 'center' }}>
        <TextStyle variant="body5">Items per page: </TextStyle>
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          sx={{
            '& .MuiInputBase-input': {
              minHeight: 0,
              padding: 1,
              pr: 1,
            },
            '& .MuiSelect-select': {
              ...theme.typography.body5,
            },
            '& .MuiSvgIcon-root': {
              fontSize: theme.typography.body5.fontSize,
            },
            minWidth: '3vw',
            ml: 2,
          }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem
              key={size}
              value={size}
              sx={{ ...theme.typography.body5, fontWeight: 500 }}
            >
              {size}
            </MenuItem>
          ))}
        </Select>
      </RowWrapper>
      <PaginationBase
        shape="rounded"
        count={totalPage || 1}
        page={currentPage}
        onChange={(_, val) => handlePageChange(val)}
        color="primary"
        sx={{
          '.MuiPaginationItem-icon': {
            height: '1.25vw',
            width: '1.25vw',
          },
          '.MuiPaginationItem-root': {
            borderRadius: '0.4vw',
            height: '1.25vw',
          },
          '.MuiPaginationItem-text': {
            ...theme.typography.body5,
          },
        }}
      />
    </RowWrapper>
  );
};

export default Pagination;
