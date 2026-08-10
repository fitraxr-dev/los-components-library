'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useBusinessGroupTable } from './BusinessGroupSection.hook';


const BusinessGroupTable = () => {
  const {
    businessGroupListContents,
    businessGroupListLoading,
    tableHeader,
  } = useBusinessGroupTable();


  const hasBusinessGroup = businessGroupListContents && businessGroupListContents.length > 0;

  if (!hasBusinessGroup && !businessGroupListLoading) {
    return null;
  }

  return (
    <SectionTitle title="Group Usaha" isOpen>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={businessGroupListContents}
          isLoading={businessGroupListLoading}
        />
      </BaseContainer>
    </SectionTitle>
  );
};

export default BusinessGroupTable;
