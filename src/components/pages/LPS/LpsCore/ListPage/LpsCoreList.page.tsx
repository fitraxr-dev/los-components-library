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

import useLps from './LpsCoreList.hook';


const LpsCoreListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    data,
    filterContentList,
    filterDropdownList,
    page,
    isLoading,
    isFetching,
  } = useLps();

  return (
    <>
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <Title title="Loan Processing Summary CORE List" />
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
            isLoading={isFetching}
            tableHeader={tableHeader}
            tableData={data?.contents}
            totalPage={data?.page?.totalPage}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
    </>
  );
};

export default LpsCoreListPage;
