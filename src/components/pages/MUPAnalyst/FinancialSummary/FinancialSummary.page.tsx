'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useFinancialSummary } from './FinancialSummary.hook';


const FinancialSummary = () => {
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useMUPAnalystContext();
  const {
    container,
    setContainer,
    financingDetail,
    handleSave,
    isSubmitting,
    setShouldGoNext,
    renderActionButtons,
  } = useFinancialSummary();

  const renderButton = () => {
    if (viewOnly) {
      return (
        <Button onClick={goToNextStep}>
          Next
        </Button>
      );
    } else {
      return (
        <>
          <Button
            isLoading={isSubmitting}
            onClick={() => {
              setShouldGoNext(false);
              convertToDocx(container).then(handleSave);
            }}
          >
            Save
          </Button>
          {...renderActionButtons()}
        </>
      );
    }
  };
  return (

    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Keuangan" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
      <WordEditor
        container={container}
        setContainer={setContainer}
        isReadOnly={viewOnly}
        initialValue={financingDetail?.description}
        isLoading={isSubmitting}
        onSave={(blob) => {
          setShouldGoNext(false);
          handleSave(blob);
        }}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {renderButton()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FinancialSummary;
