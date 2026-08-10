'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useTableOtherParties from './TableOtherParties.hooks';


const TableOtherParties = () => {
  const { tableHeaderList } = useTableOtherParties();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Shareholder" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          tableData={[]}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TableOtherParties;
