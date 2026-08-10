'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useAdditionalInformation } from './AdditionalInformation.hook';


const AdditionalInformationPage = () => {
  const theme = useTheme();

  const {
    container,
    setContainer,
    handleSave,
    additionalInfoDetail,
    isSubmitting,
    viewOnly,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
  } = useAdditionalInformation();

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Additional Information" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <RowWrapper marginBottom={theme.spacing(8)}>
        <WordEditor
          id="additional"
          isLoading={isSubmitting}
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          initialValue={additionalInfoDetail?.description}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </RowWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        <Button onClick={handleSave}>
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
