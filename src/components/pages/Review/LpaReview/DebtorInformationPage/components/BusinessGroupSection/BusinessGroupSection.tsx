'use client';
import React from 'react';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { useBusinessGroupTable } from './BusinessGroupSection.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const BusinessGroupTable = () => {
  const {
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    noPage,
    setItemPerPage,
    setNoPage,
  } = useBusinessGroupTable();

  const tableHeaderDigitalMemo: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '4%' },
      type: 'index',
    },
    {
      key: 'groupName',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupType',
      label: 'Jenis Group Usaha',
    },
  ];

  return (
    <>
      <SectionTitle title="Group Usaha" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderDigitalMemo}
            tableData={businessGroupListContents}
            isLoading={businessGroupListLoading}
            currentPage={noPage}
            totalPage={businessGroupListPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default BusinessGroupTable;
