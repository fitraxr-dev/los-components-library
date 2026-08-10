'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
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
  } = useRatingHistory();

  return (
    <BaseContainer>
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
      </ColumnWrapper>
    </BaseContainer>
  );
};

export default RatingHistory;
