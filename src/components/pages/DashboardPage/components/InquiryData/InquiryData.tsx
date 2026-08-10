import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useInquiryData } from './InquiryData.hook';


const InquiryData = () => {
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    filterContentList,
    filterInquiryDataList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useInquiryData();


  return (
    <BaseContainer sx={{ overflow: 'auto' }}>
      <RowWrapper alignItems="center" justifyContent="space-between">
        <Title title="Inquiry Data" />
        <Input
          type="search"
          onChange={setFilter}
          value={filter}
          placeholder="Pencarian"
          dropdownList={filterInquiryDataList || []}
          contentList={filterContentList}
        />
      </RowWrapper>

      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        totalPage={totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        maxHeight="calc(100vh - 400px)"
        anomalyRow={anomalyRowStyle}
      />
    </BaseContainer>
  );
};

export default InquiryData;
