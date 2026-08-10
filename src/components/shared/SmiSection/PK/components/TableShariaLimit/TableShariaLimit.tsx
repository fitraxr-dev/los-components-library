'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableShariaLimit from './TableShariaLimit.hook';


const TableShariaLimit = ({ isBeingProcessed, ...props }: { isBeingProcessed: boolean } & SmiComponentProps) => {
  const {
    theme,
    contents,
    facilityListData,
    facilityListLoading,
    anomalyRow,
    tableHeader,
    setItemPerPage,
    setNoPage,
    popupSelectorHandler,
    viewOnly,
    isLegalSigning,
  } = useTableShariaLimit({ ...props, isBeingProcessed });


  const page = facilityListData?.page;

  return (
    <>
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
              (!viewOnly && !isLegalSigning) ? !isBeingProcessed ?
                <TableFooter onClick={popupSelectorHandler} /> : null : null
            }
          />
        </BaseContainer>

      </SectionTitle>

    </>
  );
};

export default TableShariaLimit;
