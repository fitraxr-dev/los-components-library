'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useEsddReport from './EsddReport.hooks';


const EsddReport = () => {
  const { processId } = useIdentity();
  const {
    handleSaveOnly,
    handleSaveAndNext,
    handleNext,
    container,
    setContainer,
    data,
    viewOnly,
    isAutoSaveFetching,
    isLoading,
    canUpdateEsddReport,
  } = useEsddReport();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />
      <Title title="Enviromental and Social Due Dilligence Report" />

      <WordEditor
        container={container}
        setContainer={setContainer}
        initialValue={data?.description}
        isReadOnly={viewOnly || !canUpdateEsddReport}
      />

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        {viewOnly || !canUpdateEsddReport ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <>
            <Button
              disabled={isLoading || isAutoSaveFetching}
              isLoading={isLoading}
              onClick={handleSaveOnly}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={handleSaveAndNext}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EsddReport;
