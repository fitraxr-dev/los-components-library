'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import type { BusinessGroupSectionProps } from './BusinessGroupSection.types';


const BusinessGroupSection = (props: BusinessGroupSectionProps) => {
  const {
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tablePage,
    tableHeader,
    tableLoading,
    handleOpenAddModal,
    hasTableFooter = false,
  } = props;

  return (
    <SectionTitle title="Group Usaha" isOpen>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          isLoading={tableLoading}
          currentPage={noPage}
          totalPage={tablePage.totalPage ?? 1}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={hasTableFooter && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
        />
      </BaseContainer>
    </SectionTitle>
  );
};

export default BusinessGroupSection;
