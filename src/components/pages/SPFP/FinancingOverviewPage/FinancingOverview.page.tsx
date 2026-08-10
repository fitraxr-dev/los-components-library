'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
} from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
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

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import AlertFinancingOverview from './components/AlertFinancingOverview/AlertFinancingOverview';
import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = () => {
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const bucket = useSpfpBucketContext();
  const { recordActivity } = useRecordLog();
  const {
    remark,
    isAutoSaveFetching,
    isSaveLoading,
    setRemark,
    goToNextStep,
    setShouldGoNext,
    handleSave,
  } = useFinancingOverview();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view financing overview page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
    DUS_DIVISION,
  ];
  const isBusiness = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);

  const isMaker = state.currentRole.includes('MAKER');
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');

  const isSpfpFinal = bucket?.process === TypeProcess.SPFP_FINAL;
  const isSpfpDpop = bucket?.process === TypeProcess.SPDP;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isSpfpDpop && (
        <ConfirmationLatest />
      )}
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <AlertFinancingOverview />
      <TableDebtorInformation {...bucket} />
      <SectionTitle title="Fasilitas Pembiayaan yang Diajukan" isOpen>
        <TableFinancingFacilitySubmit />
        <Input
          isMandatory
          label="Keterangan"
          type="area"
          rows={4}
          value={remark}
          onChange={setRemark}
          disabled={viewOnly || (!isBusiness && !isMaker && !isTaskForce) || isSpfpFinal}
        />
      </SectionTitle>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {(isBusiness || isMaker || isTaskForce) && !isSpfpFinal && (
          <Button
            isLoading={isSaveLoading}
            disabled={viewOnly || !(!!remark) || isAutoSaveFetching}
            onClick={() => {
              handleSave();
              setShouldGoNext(false);
            }}
          >
            {isAutoSaveFetching && !viewOnly ? 'Auto Saving...' : 'Save'}
          </Button>
        )}
        <Button
          isLoading={isSaveLoading}
          onClick={() => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: bucket?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: bucket?.module || '',
              process: bucket?.process || '',
              remarks: `click next button on financing overview for bucket: ${bucket?.bucketProcessId}`,
            });
            if (isSpfpFinal || isSpfpDpop) {
              goToNextStep();
              return;
            }
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
