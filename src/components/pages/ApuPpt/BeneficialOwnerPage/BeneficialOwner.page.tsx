'use client';

import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import TableDocumentVerification from '../components/TableDocumentVerification';

import useBeneficialOwner from './BeneficialOwner.hook';


const BeneficialOwner = () => {
  const { goToNextStep } = useApuPptContext();
  const { viewOnly } = useViewOnly();

  const {
    tableHeader,
    isAutoSaveFetching,
    isLoading,
    handleOnSave,
    isSaveBeneficialRemarkLoading,
    process,
    tablerHeadChildVerif,
    tablerHeadGrandChildVerif,
    isLoadingSimiliar,
    isLoadingBucket,
    tableData,
    listDiff,
    control,
  } = useBeneficialOwner();

  return (
    <ColumnWrapper >
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Beneficial Owner" />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />

        <BaseContainer sx={{ boxShadow: 7 }}>
          <TableDocumentVerification
            isLoading={isLoading || isLoadingSimiliar || isLoadingBucket}
            tableHeader={tableHeader}
            tableData={tableData}
            listDiff={listDiff}
            tableHeaderChild={tablerHeadChildVerif}
            tableHeaderGrandChild={tablerHeadGrandChildVerif}
          />
        </BaseContainer>

        <Controller
          control={control}
          name="remark"
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              label="Keterangan"
              rows={4}
              disabled={viewOnly}
            />
          )}
        />

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {viewOnly ? (
            <Button
              onClick={goToNextStep}
              isLoading={isSaveBeneficialRemarkLoading}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                disabled={isSaveBeneficialRemarkLoading || isAutoSaveFetching}
                isLoading={isSaveBeneficialRemarkLoading}
                onClick={() => handleOnSave({ goToNext: false })}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                disabled={isSaveBeneficialRemarkLoading}
                isLoading={isSaveBeneficialRemarkLoading}
                onClick={() => handleOnSave({ goToNext: true })}
              >
                Next
              </Button>
            </>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default BeneficialOwner;
