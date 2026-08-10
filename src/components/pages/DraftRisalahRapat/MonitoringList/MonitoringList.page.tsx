'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useMonitoringList from './MonitoringList.hooks';


const MonitoringList = () => {
  const theme = useTheme();
  const {
    filter,
    setFilter,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    data,
  } = useMonitoringList();

  return (
    <>
      <Title title="Monitoring Risalah Rapat" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box width="45vw">
            <Input
              type="search"
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
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={data?.contents || []}
            totalPage={data?.page?.totalPage}
            currentPage={1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
    </>
  );
};

export default MonitoringList;
