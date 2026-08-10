'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import AlertMIPExpired from '@/components/pages/MIP/DebtorInformationPage/components/AlertMIPExpired/AlertMIPExpired';
import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
// import ModalDetailFacility from './components/ModalDetailFacility';
// import ModalFormFacility from './components/ModalFormFacility';
// import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import ModalDetailFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalTablePaymentFacilityExisting';
// import { modal } from './FinancingOverview.constants';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';
import Title from '@/components/shared/Title';

import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { useFinancingOverview } from './FinancingOverview.hook';
import useGetHasModifiedData from './hooks/useGetHasModifiedData';
import useGetListFinancingFacility from './hooks/useGetListFinancingFacility';


const FinancingOverview = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const {
    bucketMasterId,
    remark,
    isSaveLoading,
    isAutoSaveFetching,
    setRemark,
    setShouldGoNext,
    handleSave,
    stepperStatus,
    stepperSteps,
    hasShownFacilityAlert,
  } = useFinancingOverview();

  const { data: financingFacilityListData } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: processId,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    page: {
      itemPerPage: 999,
      noPage: 1,
    },
  } as any);

  const { data: hasModifiedData } = useGetHasModifiedData({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const hasIncompleteFacility = hasModifiedData === true;

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      {hasIncompleteFacility && (
        <AlertMIPExpired message="Fasilitas Usulan masih memiliki data yang belum lengkap. Mohon segera dilakukan pengkinian data" />
      )}
      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
      <SectionTitle title="Fasilitas Pembiayaan yang Diajukan" isOpen>
        <TableFinancingFacilitySubmit hasShownFacilityAlert={hasShownFacilityAlert} />
        <Input
          isMandatory
          label="Keterangan"
          type="area"
          rows={4}
          value={remark}
          onChange={setRemark}
          disabled={viewOnly}
        />
      </SectionTitle>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly || !(!!remark) || isAutoSaveFetching}
          onClick={() => {
            handleSave();
            setShouldGoNext(false);
          }}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly || !(!!remark)}
          onClick={() => {
            handleSave();
            setShouldGoNext(true);
          }}
        >
          Next
        </Button>
      </RowWrapper>

      <ModalDef
        id={modal.PAYMENT_FACILITY_FORM}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={modal.PAYMENT_FACILITY_DETAIL}
        component={ModalDetailFacility}
      />
    </ColumnWrapper>
  );
};

export default FinancingOverview;
