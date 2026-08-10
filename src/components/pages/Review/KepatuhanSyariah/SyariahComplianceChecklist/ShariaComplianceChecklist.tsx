'use client';
import React, { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useShariaComplianceChecklist from './ShariaComplianceChecklist.hooks';


const ShariaComplianceChecklist = () => {
  const { processId } = useIdentity();
  const [container, setContainer] = useState(null);
  const {
    setPage,
    setPageSize,
    TABLE_HEADER,
    NEW_DATA,
    viewOnly,
    handleSaveOnly,
    handleSaveAndNext,
    canUpdateShariahCompliance,
    handleNext,
    synfcusion,
    theme,
    isAutoSaveFetching,
    isSaveLoading,
  } = useShariaComplianceChecklist(container);

  const handleConvertAndSave = (saveFunction: (blob: Blob) => void) => {
    convertToDocx(container)
      .then(saveFunction)
      .catch((error) => {
        console.error('Error converting to DOCX:', error);
      });
  };

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(2) }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />
      <BaseContainer>
        <Title title="Checklist Kepatuhan Syariah" />
        <Table
          tableHeader={TABLE_HEADER}
          tableData={NEW_DATA}
          renderFooter={() => null}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>
      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly || !canUpdateShariahCompliance}
        container={container}
        setContainer={setContainer}
        initialValue={synfcusion?.description}
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly || !canUpdateShariahCompliance ? (
          <Button
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              disabled={isSaveLoading || isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => handleConvertAndSave(handleSaveOnly)}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              disabled={isSaveLoading}
              isLoading={isSaveLoading}
              onClick={() => handleConvertAndSave(handleSaveAndNext)}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShariaComplianceChecklist;
