'use client';
import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import HistoryListTable from '../components/HistoryListTable/HistoryListTable';


const ApprovalMasterPage = () => {

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Approval Master Tipe Permohonan" />
      <HistoryListTable />
    </ColumnWrapper>
  );

};

export default ApprovalMasterPage;
