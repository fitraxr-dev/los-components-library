'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import WordEditor from '@/components/shared/WordEditor';

import useAdditionalInformation from './AdditionalInformation.hook';


const AdditionalInformation = (props: any) => {
  const {
    disclaimerValue,
    canUpdateShariahCompliance,
    isEdit,
    handleEdit,
    isLoading,
    setIsLoading,
  } = props;

  const {
    container,
    setContainer,
    handleSaveKesimpulan,
    isAutoSaveFetching,
    handleButton,
    data,
    modifiedObject,
    viewOnly,
    handleClose,
  } = useAdditionalInformation(props);

  const renderActionButtons = () => {
    return modifiedObject ? Object.entries(modifiedObject).map((dt: [string, string], index: number) => {
      return handleButton(dt[0], dt[1]);
    }) : null;
  };

  return (
    <ColumnWrapper sx={{ gap: '16px' }}>
      <WordEditor
        container={container}
        setContainer={setContainer}
        isReadOnly={viewOnly || !canUpdateShariahCompliance}
        initialValue={data?.description}
        onSave={(blob) => {
          handleSaveKesimpulan(blob);
        }}
      />

      <TableUploadDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        {isEdit && canUpdateShariahCompliance && (
          <Button
            isLoading={isLoading}
            onClick={handleEdit}
          >
            Change Review
          </Button>)
        }
        {!viewOnly && canUpdateShariahCompliance ? (
          <Button
            onClick={() => { convertToDocx(container).then(handleSaveKesimpulan); }}
            isLoading={isLoading}
            disabled={isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        ) : (
          Object.keys(modifiedObject).length !== 0 ? null
            : <Button isLoading={isLoading} onClick={handleClose}>Close</Button>
        )}

        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AdditionalInformation;
