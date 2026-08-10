'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
// import ModalDetailFacility from '../../MIP/FinancingOverviewPage/components/ModalDetailFacility';
// import ModalFormFacility from './components/ModalFormFacility';
// import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import ModalDetailFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalTablePaymentFacilityExisting';
// import { modal } from './TablePaymentFacility.constants';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTablePaymentFacility from './TablePaymentFacility.hook';


const TablePaymentFacility = (props: SmiComponentProps) => {
  const { viewOnly } = useViewOnly();

  const {
    isLoading,
    page,
    pageSize,
    popupSelectorHandler,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTablePaymentFacility(props);

  return (
    <>
      <SectionTitle isMandatory title="Fasilitas Pembiayaan" isOpen>
        <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            footer={!viewOnly && <TableFooter onClick={popupSelectorHandler} />}
          />
        </BaseContainer>
      </SectionTitle>

      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={modal.PAYMENT_FACILITY_FORM}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.PAYMENT_FACILITY_DETAIL}
        component={ModalDetailFacility}
      />
    </>
  );
};

export default TablePaymentFacility;
