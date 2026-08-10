'use client';
import React from 'react';


import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useDebtorBusinessGroup from './DebtorBusinessGroup.hooks';


const DebtorBusinessGroup = () => {
  const {
    data,
    pageNo,
    setPageNo,
    setPageSize,
    tableHeaderList,
  } = useDebtorBusinessGroup();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Group Usaha Customer" />
      <SectionTitle title="Group Usaha Customer" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderList}
          tableData={data?.contents}
          currentPage={pageNo}
          totalPage={data?.page?.totalPage}
          handlePageChange={setPageNo}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default DebtorBusinessGroup;
