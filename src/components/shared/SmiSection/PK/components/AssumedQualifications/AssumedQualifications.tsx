import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';


import useAssumedQualifications from './AssumedQualifications.hook';

import type { PkTabsProps } from '../../PK.types';


const AssumedQualifications = (
  {
    actionBtn,
    handleNextTab,
  }: PkTabsProps
) => {
  const {
    containerAdditional,
    containerAssum,
    setContainerAdditional,
    setContainerAssum,
    formattedActionButton,
    handleButton,
    handleNext,
    handleSave,
    assumsiDetail,
    additionalInformationDetail,
    isAutoSaveFetching,
    isLoadingAdditional,
    isLoadingAssumsi,
    childId,
    viewOnly,
    isMandatoryFieldsFilled,
  } = useAssumedQualifications({ actionBtn, handleNextTab });
  const renderActionButtons = () => {
    return formattedActionButton ? Object.entries(formattedActionButton).map((dt: [string, string]) => {
      return (handleButton(dt[0], dt[1], isMandatoryFieldsFilled));
    }) : null;
  };
  return (
    <ColumnWrapper gap={3}>
      <TextStyle
        variant="body1"
        sx={{
          fontWeight: '600',
          py: 2,
        }}
        color="#284A63"
      >
        Asumsi & Kualifikasi
      </TextStyle>

      <WordEditor
        id="assumsi-legal-signing"
        isReadOnly={viewOnly}
        isLoading={isLoadingAssumsi}
        container={containerAssum}
        setContainer={setContainerAssum}
        initialValue={assumsiDetail?.description}
      />
      <TextStyle
        variant="body1"
        sx={{
          fontWeight: '600',
          py: 2,
        }}
        color="#284A63"
      >
        Additional Information
      </TextStyle>

      <WordEditor
        id="additional-legal-signing"
        isReadOnly={viewOnly}
        isLoading={isLoadingAdditional}
        container={containerAdditional}
        setContainer={setContainerAdditional}
        initialValue={additionalInformationDetail?.description}
      />
      <TableUploadDocument
        process={TypeProcess.PROCESSING_TYPE_PK}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        childId={childId}
      />

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        {!viewOnly && (
          <Button onClick={handleSave} disabled={isAutoSaveFetching}>
            {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
          </Button>
        )}
        <Button onClick={handleNext}>
          Next
        </Button>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AssumedQualifications;
