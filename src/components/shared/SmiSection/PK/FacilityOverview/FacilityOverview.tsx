'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalTablePaymentFacilityExisting';
import {
  modal,
  modal as modalPaymentFacility,
} from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ModalDetailFacility from '../components/ModalDetailFacility';
import ModalDetailFacilityPengajuanPerikatan from '../components/ModalDetailFacilityPengajuanPerikatan';
import ModalFormFacilityPengajuanPerikatan from '../components/ModalFormFacilityPengajuanPerikatan';
import TableFinancingFacilitySubmit from '../components/TableFinancingFacilitySubmit';
import TableShariaLimit from '../components/TableShariaLimit';
import { MODALPK } from '../PK.constants';

import useFaciltyOverview from './FacilityOverview.hook';


const FacilityOverview = (props: SmiComponentProps) => {
  const { handleNext, handleFacilityManagement, isBeingProcessed, isShowFacilityManagement } = useFaciltyOverview();
  const theme = useTheme();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <RowWrapper gap={2}>
          <Title title="Ringkasan Fasilitas Pembiayaan" />
          {isBeingProcessed && (
            <Tooltip
              title={
                <Box>
                  <TextStyle variant="body6">
                    Sedang berada dalam pengajuan
                  </TextStyle>
                </Box>
              }
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                  },
                },
              }}
            >
              <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                <Icon iconName="new-info" />
              </Box>
            </Tooltip>
          )}
        </RowWrapper>
        {isShowFacilityManagement && (
          <Button startIcon="monitor" onClick={handleFacilityManagement} disabled={isBeingProcessed}>Go To Facility Management</Button>
        )}
      </RowWrapper>
      <TableFinancingFacilitySubmit {...props} isBeingProcessed={isBeingProcessed} />
      {props.showTableShariaLimit && (
        <TableShariaLimit {...props} isBeingProcessed={isBeingProcessed} />
      )}
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
      <ModalDef
        id={modal.PAYMENT_FACILITY_FORM}
        component={ModalFormFacility}
      />
      <ModalDef
        id={MODALPK.FORM_FACILITY_PENGAJUAN_PERIKATAN}
        component={ModalFormFacilityPengajuanPerikatan}
      />
      <ModalDef
        id={modalPaymentFacility.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={MODALPK.DETAIL_FACILITY}
        component={ModalDetailFacility}
      />
      <ModalDef
        id={MODALPK.DETAIL_FACILITY_PENGAJUAN_PERIKATAN}
        component={ModalDetailFacilityPengajuanPerikatan}
      />
    </ColumnWrapper>
  );
};

export default FacilityOverview;
