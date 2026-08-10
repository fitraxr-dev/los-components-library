'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalDetailFacility from './ModalDetailFacility';
import ModalFormFacility from './ModalFormFacility';
import ModalTablePaymentFacilityExisting from './ModalTablePaymentFacilityExisting';
import { modal } from './TablePaymentFacility.constants';
import useTablePaymentFacility from './TablePaymentFacility.hook';


const TablePaymentFacility = (props: SmiComponentProps) => {
  const theme = useTheme();
  const {
    facilityListData,
    facilityListLoading,
    tableHeader,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    viewOnly,
    totalOrder,
  } = useTablePaymentFacility(props);

  const contents = facilityListData?.contents.map((item) => ({
    ...item,
    orderValue: `${item?.currencyOrderValue} ${item?.orderValue}`,
    valueProject: `${item?.currencyOrderValue} ${item?.valueProject}`,
  }));
  const page = facilityListData?.page;

  return (
    <>
      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="82vh"
          tableHeader={tableHeader}
          tableData={contents}
          pageSize={5}
          isLoading={facilityListLoading}
          currentPage={page?.noPage}
          totalPage={page?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}

          renderAdditonalRow={() => (
            props?.showLine ?
              <>
                <TableCell colSpan={4}>
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
              </> : null
          )}

          footer={
            <RowWrapper
              sx={{ justifyContent: 'end', mb: 2 }}
            >
              {
                !viewOnly ? (
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
                ) : null
              }
            </RowWrapper>
          }
        />
      </BaseContainer>

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
