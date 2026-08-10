import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useTableBusinessGroup from './TableBusinessGroup.hook';


const TableBusinessGroup = () => {
  const {
    businessGroupContents,
    isBusinessGroupLoading,
    noPage,
    businessGroupPage,
    setNoPage,
    setItemPerPage,
  } = useTableBusinessGroup();

  return (
    <>
      <SectionTitle title="Group Usaha" isOpen sx={{ mb: 3 }}>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isBusinessGroupLoading}
            tableHeader={[
              {
                key: 'index',
                label: 'No',
                type: 'index',
              },
              {
                key: 'groupName',
                label: 'Nama Group Usaha',
              },
              {
                key: 'groupType',
                label: 'Jenis Group Usaha',
              }
            ]}
            tableData={businessGroupContents}
            currentPage={noPage}
            totalPage={businessGroupPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default TableBusinessGroup;
