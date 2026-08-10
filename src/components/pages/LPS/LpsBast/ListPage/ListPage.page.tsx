'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useListPage from './ListPage.hook';


const ListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    filterContentList,
    filterDropdownList,
    page,
    isLoading,
    processList,
    processPage,
    isFetching,
  } = useListPage();

  return (
    <>
      <Title title="Loan Processing Summary (LPS) BAST List" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box width="45vw">
            <Search
              value={filter}
              hasFilter
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            isLoading={isFetching}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
    </>
  );
};

export default ListPage;
