import * as React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useHistoryAskForInfo } from './TableHistoryAskForInfo.hook';


const HistoryAskForInfo = (props: SmiComponentProps) => {
  const {
    isFetchLoading,
    tableData,
    tableHeader,
    noPage,
    setNoPage,
    setItemPerPage,
    tablePage,
  } = useHistoryAskForInfo(props);

  return (
    <BaseContainer sx={{ boxShadow: 7, md: 2 }}>
      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        isLoading={isFetchLoading}
        totalPage={tablePage?.totalPage ?? 1}
        currentPage={noPage}
        handlePageChange={setNoPage}
        onPageSizeChange={setItemPerPage}
      />
    </BaseContainer>
  );
};

export default HistoryAskForInfo;
