'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ModalDetailFacility from './components/ModalDetailFacility';
import ModalFormFacility from './components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { modal } from './FinancingOverview.constants';
import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = () => {

  const {
    goToNextStep,
    processId,
  } = useFinancingOverview();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

      <TableFinancingFacilitySubmit
        parentBucketId={processId}
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          onClick={() => goToNextStep()}
        >
          Save
        </Button>
      </RowWrapper>

      <ModalDef
        id={modal.FORM_FACILITY}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={modal.DETAIL_FACILITY}
        component={ModalDetailFacility}
      />
    </ColumnWrapper>
  );
};

export default FinancingOverview;
