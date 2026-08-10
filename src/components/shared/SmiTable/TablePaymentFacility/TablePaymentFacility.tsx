'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import useViewOnly from '@/hooks/useViewOnly';

import ModalTablePaymentFacilityExistingAnnualReview from '@/components/pages/AnnualReview/FinancingOverviewPage/components/ModalTablePaymentFacilityExisting';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import BaseContainer from '../../BaseContainer';
import TableFooter from '../../TableFooter';

import ModalDetailFacility from './components/ModalDetailFacility';
import ModalFormFacility from './components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import { modal } from './TablePaymentFacility.constants';
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
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING_ANNUAL_REVIEW}
        component={ModalTablePaymentFacilityExistingAnnualReview}
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
