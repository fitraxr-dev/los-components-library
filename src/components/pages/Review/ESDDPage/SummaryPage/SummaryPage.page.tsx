'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useSummaryPage from './SummaryPage.hook';


const SummaryPage = () => {
  const { processId } = useIdentity();
  const {
    canUpdateSummary,
    container,
    setContainer,
    handleSaveKesimpulan,
    isAutoSaveFetching,
    data,
    modifiedObject,
    isEdit,
    handleEdit,
    viewOnly,
    handleClose,
    renderActionButtons,
  } = useSummaryPage();


  return (
    <ColumnWrapper sx={{ gap: '16px' }}>
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
      <RowWrapper sx={{ alignItems: 'center' }}>
        <Title title="Kesimpulan" />
      </RowWrapper>
      <WordEditor
        container={container}
        setContainer={setContainer}
        isReadOnly={viewOnly || !canUpdateSummary}
        initialValue={data?.content?.description}
        onSave={(blob) => {
          handleSaveKesimpulan(blob);
        }}
      />

      <TableUploadDocument
        process={TypeProcess.REVIEWER_DELST}
        module={TypeModule.MIP_REVIEW}
      />

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        {isEdit && canUpdateSummary && (
          <Button
            onClick={handleEdit}
          >
            Change Review
          </Button>
        )}
        {!viewOnly && canUpdateSummary && (
          <Button
            disabled={isAutoSaveFetching}
            onClick={() => { convertToDocx(container).then(handleSaveKesimpulan); }}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
        {viewOnly && Object.keys(modifiedObject).length === 0 && (
          <Button onClick={handleClose}>Close</Button>
        )}

        {renderActionButtons}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default SummaryPage;
