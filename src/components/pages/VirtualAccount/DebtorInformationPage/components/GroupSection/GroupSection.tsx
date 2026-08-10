'use client';
import React from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useGroupSection from './GroupSection.hook';


const GroupSection = () => {

  const { businessGroupListContents, businessGroupListLoading } = useGroupSection();

  return (
    <SectionTitle isOpen={true} title="Group Usaha" sx={{ mb: 3 }}>
      <BaseContainer
        sx={{
          boxShadow: 2,
        }}
      >
        <Table
          tableHeader={[
            {
              key: 'index',
              label: 'No',
              sx: { height: '3.3vw', width: '4%' },
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
          ]}
          tableData={businessGroupListContents}
          isLoading={businessGroupListLoading}
        />
      </BaseContainer>
    </SectionTitle>
  );
};

export default GroupSection;
