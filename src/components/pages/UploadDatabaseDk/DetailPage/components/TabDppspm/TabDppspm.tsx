import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';

import useTabDppspm from './TabDppspm.hook';


interface TabDppspmProps {
  uploadId: number;
}

const TabDppspm = ({ uploadId }: TabDppspmProps) => {
  const {
    tableData,
    tableHeader,
    page,
    setPage,
    setPageSize,
    isLoading,
    totalPage,
    theme,
  } = useTabDppspm(uploadId);

  return (
    <ColumnWrapper sx={{ mt: theme.spacing(1) }}>
      <BaseContainer>
        <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          currentPage={page}
          totalPage={totalPage}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TabDppspm;
