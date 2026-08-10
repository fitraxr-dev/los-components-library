'use client';
import React from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useGroupSection from './GroupSection.hook';

import type { BucketResponseDto } from '@/services/openapi/bucket-service';


const GroupSection = ({ bucketDetail }: {bucketDetail: BucketResponseDto}) => {
  const {
    businessGroupListContents,
    isLoading,
    businessGroupMasterListContents,
    businessGroupMasterListPage,
    noPage,
    setItemPerPage,
    setNoPage,
    currentModuleByBucketParent,
  } = useGroupSection({ bucketDetail });

  return (
    <Box sx={{ mb: 3 }}>
      <SectionTitle title="Group Usaha" sx={{ mb: 3 }} isOpen>
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
            ]}
            tableData={currentModuleByBucketParent === 'PIPE' ? businessGroupMasterListContents : businessGroupListContents}
            isLoading={isLoading}
            currentPage={noPage}
            totalPage={businessGroupMasterListPage?.totalPage ?? 1}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
    </Box>
  );
};

export default GroupSection;
