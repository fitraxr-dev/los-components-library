'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useFinancialSummary } from './FinancialSummary.hook';


const FinancialSummary = () => {
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useMUPContext();
  const {
    container,
    setContainer,
    financingDetail,
    handleSave,
    isSubmitting,
    setShouldGoNext,
  } = useFinancialSummary();
  return (

    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Keuangan" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
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

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        {!viewOnly ? (
          <Button
            isLoading={isSubmitting}
            onClick={() => {
              setShouldGoNext(true);
              convertToDocx(container).then(handleSave);
            }}
          >
            Save
          </Button>
        ) : (
          <Button onClick={goToNextStep}>
            Next
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FinancialSummary;
