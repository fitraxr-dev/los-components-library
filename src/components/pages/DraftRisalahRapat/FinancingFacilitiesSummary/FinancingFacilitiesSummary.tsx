'use client';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DP_2_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
} from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import TablePaymentFacility from '../TablePaymentFacility';

import { useFinancingFacilitiesSummary } from './FinancingFacilitiesSummary.hook';


const FinancingFacilitiesSummary = () => {
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const {
    remark,
    isAutoSaveFetching,
    isSaveLoading,
    setRemark,
    handleSave,
    setShouldGoNext,
  } = useFinancingFacilitiesSummary();

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

  return (
    <ColumnWrapper sx={{ gap: 3, pb: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />

      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

      <TablePaymentFacility
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />

      <Input
        isMandatory
        label="Keterangan"
        type="area"
        rows={4}
        value={remark}
        onChange={setRemark}
        disabled={viewOnly || (!isBusiness && !isMaker && !isTaskForce)}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {(isBusiness || isMaker || isTaskForce) && (
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
          isLoading={isSaveLoading || isAutoSaveFetching}
          onClick={() => {
            handleSave();
            setShouldGoNext(true);
          }}
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper >
  );
};

export default FinancingFacilitiesSummary;
