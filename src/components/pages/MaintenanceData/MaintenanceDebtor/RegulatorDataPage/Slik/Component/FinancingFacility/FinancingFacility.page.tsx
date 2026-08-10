import { Box } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../../../components/ActionFooterDetail/ActionFooterDetail';

import { useFinancingFacility } from './FinancingFacility.hooks';


const FinancingFacility = ({ isSyariah }: { isSyariah?: boolean }) => {

  const {
    theme,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    tableHeader,
    isLoading,
    totalPage,
    currentPage,
    setCurrentPage,
    setPageSize,
    slikFinancingFacilityData,
    anomalyRowStyle,
  } = useFinancingFacility(isSyariah);

  return (
    <ColumnWrapper>
      <Box width="45vw">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
      </Box>
      <Table
        tableHeader={tableHeader}
        tableData={slikFinancingFacilityData || []}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        anomalyRow={anomalyRowStyle}
      />

      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default FinancingFacility;
