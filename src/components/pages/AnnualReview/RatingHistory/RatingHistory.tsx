'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useRatingHistory } from './RatingHistory.hook';


const RatingHistory = () => {
  const theme = useTheme();
  const {
    isLoading,
    ratingHistoryList,
    ratingHistoryPage,
    HISTORY_TABLE_HEADER,
    page,
    setPage,
    setPageSize,
    handleSubmit,
    selected,
    isCopyLoading,
    isStandaloneReRating,
  } = useRatingHistory();

  return (
    <ColumnWrapper sx={{ gap: 4 }}>
      <Title
        title="Detail History Rating"
        sx={{
          borderBottom: 1,
          borderBottomColor: theme.palette.disabled.main,
          borderBottomStyle: 'solid',
          justifyContent: 'center',
        }}
      />

      <Table
        isLoading={isLoading}
        tableHeader={HISTORY_TABLE_HEADER}
        tableData={ratingHistoryList}
        totalPage={ratingHistoryPage?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {!isStandaloneReRating && (
        <RowWrapper justifyContent="end">
          <Button
            disabled={!selected || isCopyLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default RatingHistory;
