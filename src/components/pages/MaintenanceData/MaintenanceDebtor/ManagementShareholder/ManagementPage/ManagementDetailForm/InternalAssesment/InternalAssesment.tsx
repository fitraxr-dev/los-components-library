'use client';


import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useInternalAssesment from './InternalAssesment.hook';


const InternalAssesment = () => {
  const theme = useTheme();

  const {
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isLoading,
    tableHeader,
    tableData,
    tablePage,
    noPage,
    setNoPage,
    setItemPerPage,
  } = useInternalAssesment();


  return (
    <ColumnWrapper gap={theme.spacing(3)}>
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
        {/* <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={tablePage?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        /> */}
        <EmptyPlaceholder status="coming-soon" />

      </BaseContainer>
    </ColumnWrapper>
  );
};

export default InternalAssesment;
