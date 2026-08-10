'use client';
import React from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useGroupSection from './GroupSection.hook';


const GroupSection = () => {

  const { businessGroupListData, businessGroupListLoading, tableHeaderGroup } = useGroupSection();

  return (
    <Box sx={{ mb: 3 }}>
      <SectionTitle title="Group Usaha" sx={{ mb: 3 }} isOpen>
        <BaseContainer
          sx={{
            boxShadow: 2,
          }}
        >
          <Table
            tableHeader={tableHeaderGroup}
            tableData={businessGroupListData}
            isLoading={businessGroupListLoading}
          />
        </BaseContainer>
      </SectionTitle>
    </Box>
  );
};

export default GroupSection;
