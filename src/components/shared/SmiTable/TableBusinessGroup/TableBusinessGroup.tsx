'use client';

import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useBusinessGroupTable } from './TableBusinessGroup.hook';


const TableBusinessGroup = (props: any) => {
  const [state] = useApp();
  const viewOnly = useViewOnly();
  const {
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    noPage,
    tableHeaderBusinessGroup,
    setItemPerPage,
    setNoPage,
  } = useBusinessGroupTable(props);

  return (
    <>
      <SectionTitle title="Group Usaha" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderBusinessGroup}
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

export default TableBusinessGroup;
