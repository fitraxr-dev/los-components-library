import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useTableSubmissionHistory from './TableSubmissionHistory.hook';


const TableSubmissionHistory = () => {

  const {
    tableHeader,
    isLoading,
    listDataHistory,
  } = useTableSubmissionHistory();

  return (
    <ColumnWrapper sx={{ gap: 3, py: 3 }}>
      <SectionTitle title="History PK/Adendum" isOpen>
        <Table
          isPaper
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={listDataHistory}
        />
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableSubmissionHistory;
