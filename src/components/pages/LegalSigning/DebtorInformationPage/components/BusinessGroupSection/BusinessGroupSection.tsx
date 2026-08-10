'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useBusinessGroupTable } from './BusinessGroupSection.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const BusinessGroupTable = () => {
  const {
    businessGroupListContents,
    businessGroupListLoading,
  } = useBusinessGroupTable();

  const tableHeaderGroupList: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '3.5vw',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupType',
      label: 'Jenis Group Usaha',
      sx: {
        minWidth: '7.5vw',
      },
    },
  ];

  const hasBusinessGroup = businessGroupListContents && businessGroupListContents.length > 0;

  if (!hasBusinessGroup && !businessGroupListLoading) {
    return null;
  }

  return (
    <>
      <SectionTitle title="Group Usaha" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderGroupList}
            tableData={businessGroupListContents}
            isLoading={businessGroupListLoading}
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default BusinessGroupTable;
