import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useFinancingFacility from './TableFinancingFacility.hook';


const TableFinancingFacility = () => {
  const theme = useTheme();

  const {
    filter,
    processList,
    isLoading,
    setPage,
    setPageSize,
    page,
    tableHeader,
    setFilter,
    filterDropdownList,
    filterContentList,
    processPage,
    anomalyRow,
  } = useFinancingFacility();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle
        title="Fasilitas Pembiayaan Yang Diajukan"
        isOpen
      >
        <Box sx={{ width: '45vw' }}>
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
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            isLoading={isLoading}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRow}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableFinancingFacility;
