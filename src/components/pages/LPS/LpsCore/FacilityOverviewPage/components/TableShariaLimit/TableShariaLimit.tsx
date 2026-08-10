'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableShariaLimit from './TableShariaLimit.hook';


const TableShariaLimit = (props: SmiComponentProps) => {
  const {
    contents,
    facilityListData,
    facilityListLoading,
    anomalyRow,
    tableHeader,
    setItemPerPage,
    setNoPage,
    popupSelectorHandler,
    viewOnly,
    isBeingProcessed,
  } = useTableShariaLimit(props);

  const page = facilityListData?.page;

  return (

    <SectionTitle title="Limit Induk Syariah" isOpen>
      <BaseContainer sx={{ boxShadow: 2 }}>
        <Table
          maxHeight="82vh"
          tableHeader={tableHeader}
          tableData={contents}
          pageSize={5}
          currentPage={page?.noPage}
          totalPage={page?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          anomalyRow={anomalyRow}
          isLoading={facilityListLoading}
          footer={
            !viewOnly && !isBeingProcessed && (<TableFooter onClick={popupSelectorHandler} />)
          }
        />
      </BaseContainer>

    </SectionTitle>

  );
};

export default TableShariaLimit;
