'use client';
import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';

import { convertToDocx } from '@/helpers/synfusion';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useAdditionalInformation from './AdditionalInformation.hooks';
import TableRisalahRapat from './components/TableUpdateRisalahRapat';


const AdditionalInformationPage = () => {
  const {
    container,
    setContainer,
    viewOnly,
    handleSave,
    isAutoSaveFetching,
    isSaveLoading,
    additionalInformationDetail,
    goToNextStep,
    isFetchLoading } = useAdditionalInformation();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={additionalInformationDetail?.description}
      />

      <TableRisalahRapat />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>

        <Button
          disabled={isAutoSaveFetching}
          onClick={() => {
            convertToDocx(container)
              .then(handleSave);
          }}
        >
          {isAutoSaveFetching && !viewOnly ? 'Auto Saving...' : viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
