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

import useExecutiveSummary from './ExecutiveSummary.hooks';


const ExecutiveSummary = () => {
  const { processId } = useIdentity();
  const {
    container,
    setContainer,
    data,
    handleSaveOnly,
    handleSaveAndNext,
    handleNext,
    viewOnly,
    isAutoSaveFetching,
    isLoading,
    canUpdateExecutiveSummary,
  } = useExecutiveSummary();


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

      <Title title="Executive Summary" />

      <WordEditor
        container={container}
        setContainer={setContainer}
        initialValue={data?.description}
        isReadOnly={viewOnly || !canUpdateExecutiveSummary}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly || !canUpdateExecutiveSummary ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isLoading}
              disabled={isLoading || isAutoSaveFetching}
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

export default ExecutiveSummary;
