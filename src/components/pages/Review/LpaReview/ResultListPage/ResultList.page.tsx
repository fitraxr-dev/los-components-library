'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { mockTableDataResultList } from '../__mock_data__/mockResultListPage';

import { useResultList } from './ResultList.hook';


const ResultListPage = () => {
  const theme = useTheme();

  const { noPage, setNoPage, setItemPerPage, tableHeader } = useResultList();

  return (
    <>
      <Title title="Review LPA KJPP Result" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <Box width="45vw">
          <Input
            type="search"
            onChange={() => { }}
            placeholder="Pencarian"
            dropdownList={[
              {
                label: 'ID',
                value: 'id',
              }
            ]}
            contentList={[]}
          />
        </Box>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={mockTableDataResultList}
            totalPage={1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </ColumnWrapper>
    </>
  );
};

export default ResultListPage;
