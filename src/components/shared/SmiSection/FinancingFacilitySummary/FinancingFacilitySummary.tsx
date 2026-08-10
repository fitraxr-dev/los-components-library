'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';

import AlertMIPExpired from '@/components/pages/MIP/DebtorInformationPage/components/AlertMIPExpired/AlertMIPExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import ModalDetailFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalTablePaymentFacilityExisting';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';
import Title from '@/components/shared/Title';

import SectionTitle from '../../SectionTitle';

// import ModalDetailFacility from './components/ModalDetailFacility';
// import ModalFormFacility from './components/ModalFormFacility';
// import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';

import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { useFinancingFacilitySummary } from './FinancingFacilitySummary.hook';

// import { modal } from './FinancingOverview.constants';


const FinancingFacilitySummary = ({ process, module }: SmiComponentProps) => {
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();

  const { handleSave, hasIncompleteFacility, isSaveLoading, remark, setRemark, setShouldGoNext, isAutoSaveFetching } =
    useFinancingFacilitySummary({ module, process });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />

      {hasIncompleteFacility && (
        <AlertMIPExpired message="Fasilitas Usulan masih memiliki data yang belum lengkap. Mohon segera dilakukan pengkinian data" />
      )}

      <TableDebtorInformation module={module} process={process} />

      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen sx={{ mb: 2 }}>
        <ColumnWrapper gap={2}>
          <TableFinancingFacilitySubmit module={module} process={process} />

          <Input
            isMandatory
            label="Keterangan"
            type="area"
            rows={4}
            value={remark}
            onChange={setRemark}
            disabled={viewOnly}
          />
        </ColumnWrapper>
      </SectionTitle>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button onClick={goToNextStep}>Next</Button>
        ) : (
          <>
            <Button
              disabled={!remark || isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => {
                setShouldGoNext(false);
                handleSave();
              }}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>

            <Button
              disabled={!remark}
              isLoading={isSaveLoading}
              onClick={() => {
                setShouldGoNext(true);
                handleSave();
              }}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>

      <ModalDef id={modal.PAYMENT_FACILITY_FORM} component={ModalFormFacility} />
      <ModalDef id={modal.TABLE_PAYMENT_FACILITY_EXISTING} component={ModalTablePaymentFacilityExisting} />
      <ModalDef id={modal.PAYMENT_FACILITY_DETAIL} component={ModalDetailFacility} />
    </ColumnWrapper>
  );
};

export default FinancingFacilitySummary;
