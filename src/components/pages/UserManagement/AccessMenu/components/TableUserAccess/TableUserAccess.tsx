import React from 'react';

import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { tableHeader } from './TableUserAccess.constants';
import useTableUserAccess from './TableUserAccess.hook';


const TableUserAccess = () => {
  const theme = useTheme();

  const {
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tablePage,
    isUserUsageLoading,
  } = useTableUserAccess();

  return (
    <BaseContainer sx={{ boxShadow: 7, marginTop: theme.spacing(3) }}>
      <ColumnWrapper gap={theme.spacing(3)} paddingTop={theme.spacing(2)}>
        <Title title="User Access" />
        <Table
          tableHeader={tableHeader}
          isLoading={isUserUsageLoading}
          tableData={tableData}
          totalPage={tablePage?.totalPage ?? 1}
          currentPage={noPage}
          onPageSizeChange={setItemPerPage}
          handlePageChange={setNoPage}
        />
      </ColumnWrapper>
    </BaseContainer>
  );
};

export default TableUserAccess;
