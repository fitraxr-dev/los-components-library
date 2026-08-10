import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import useTableInternalConcern from './TableInternalConcern.hook';


interface TableInternalConcernProps {
  viewOnly?: boolean;
}

const TableInternalConcern = ({ viewOnly = false }: TableInternalConcernProps) => {

  const {
    tableHeader,
    concernList,
    isConcernListLoading,
  } = useTableInternalConcern({ viewOnly });

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
