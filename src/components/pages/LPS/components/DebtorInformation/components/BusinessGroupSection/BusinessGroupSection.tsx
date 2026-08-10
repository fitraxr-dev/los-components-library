'use client';


import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useBusinessGroupTable } from './BusinessGroupSection.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const BusinessGroupTable = (props: SmiComponentProps) => {
  const {
    bucketBusinessGroup,
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    noPage,
    setItemPerPage,
    setNoPage,
  } = useBusinessGroupTable(props);

  const tableHeaderDigitalMemo: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '55px',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupTypeLabel',
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
