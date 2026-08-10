'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';


import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalDetailFacility from '@/components/shared/SmiSection/PK/components/ModalDetailFacility';
import { MODALPK } from '@/components/shared/SmiSection/PK/PK.constants';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalTablePaymentFacilityExisting';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL_FINANCING } from '../../FacilityOverview.constants';

import useTableFinancingFacilitySubmit from './TableFinancingFacilitySubmit.hook';


const TableFinancingFacilitySubmit = (props: SmiComponentProps) => {
  const { viewOnly } = useViewOnly();
  const {
    theme,
    contents,
    itemPerPage,
    facilityListLoading,
    anomalyRow,
    tableHeader,
    totalOrder,
    totalOrderPk,
    canAdd,
    isBeingProcessed,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    page,
  } = useTableFinancingFacilitySubmit(props);

  return (
    <>
      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen>
        <BaseContainer sx={{ boxShadow: 2 }}>
          <Table
            maxHeight="82vh"
            tableHeader={tableHeader}
            tableData={contents}
            // pageSize={itemPerPage}
            // currentPage={page?.noPage}
            // totalPage={page?.totalPage}
            // handlePageChange={setNoPage}
            // onPageSizeChange={setItemPerPage}
            // isLoading={facilityListLoading}
            anomalyRow={anomalyRow}
            renderAdditonalRow={() => (
              <>
                <TableCell colSpan={7}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {totalOrder}
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {totalOrderPk}
                  </TextStyle>
                </TableCell>

              </>
            )}
            // Permintaan BA di hide Sementara
            footer={
              <RowWrapper
                sx={{ justifyContent: 'end', mb: 2, mt: 2 }}
              >
                {viewOnly || !canAdd || isBeingProcessed ? null : (
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{
                      height: theme.spacing(6),
                      padding: theme.spacing(1),
                    }}
                    onClick={popupSelectorHandler}
                  >
                    Add New
                  </Button>
                )}
              </RowWrapper>
            }
          />
        </BaseContainer>
      </SectionTitle>
      <ModalDef
        id={MODALPK.DETAIL_FACILITY}
        component={ModalDetailFacility}
      />

      <ModalDef
        id={modal.PAYMENT_FACILITY_FORM}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
    </>
  );
};

export default TableFinancingFacilitySubmit;
