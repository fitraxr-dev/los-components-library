'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import type { ProcessDetailItem } from '../ProgressRate.types';


interface OverviewListSectionProps {
  overviewListData: ProcessDetailItem[];
  loading: boolean;
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  tableHeader: any[];
}

const OverviewListSection = ({
  overviewListData,
  loading,
  currentPage,
  totalPage,
  onPageChange,
  onPageSizeChange,
  tableHeader,
}: OverviewListSectionProps) => {
  return (
    <BaseContainer>
      <Box sx={{ p: 2 }}>
        <Table
          isLoading={loading}
          tableHeader={tableHeader}
          tableData={overviewListData}
          currentPage={currentPage}
          totalPage={totalPage}
          handlePageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
    </BaseContainer>
  );
};

export default OverviewListSection;
