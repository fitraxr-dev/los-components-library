'use client';
import * as React from 'react';

import { Box, useTheme } from '@mui/material';

import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { useLogSPFP } from './LogSPFP.hook';


const LogSPFPPage = () => {
  const theme = useTheme();
  const [state] = useApp();
  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const {
    filter,
    filterDropdownList,
    filterContentList,
    listContents,
    listPage,
    isLoading,
    page,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
  } = useLogSPFP();

  return (
    <ColumnWrapper>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <Title title="Log SPFP" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
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

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="55vh"
            tableHeader={tableHeader}
            tableData={listContents}
            totalPage={listPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default LogSPFPPage;
