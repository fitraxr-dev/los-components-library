import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import useTableInternalConcern from './TableInternalConcern.hook';


const TableInternalConcern = () => {

  const {
    tableHeader,
    concernList,
    isConcernListLoading,
  } = useTableInternalConcern();

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <Table
        isLoading={isConcernListLoading}
        tableHeader={tableHeader}
        tableData={concernList}
      />
    </BaseContainer>
  );
};

export default TableInternalConcern;
