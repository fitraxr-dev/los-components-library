import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import useTableExternalConcern from './TableExternalConcern.hook';


interface TableExternalConcernProps {
  viewOnly?: boolean;
}

const TableExternalConcern = ({ viewOnly = false }: TableExternalConcernProps) => {

  const {
    tableHeader,
    concernList,
    isConcernListLoading,
  } = useTableExternalConcern({ viewOnly });

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

export default TableExternalConcern;
