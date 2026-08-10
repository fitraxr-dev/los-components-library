'use client';
import { useState } from 'react';

import { useTheme } from '@mui/material';

import { TypeProcess, TypeModule } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useAssumptionQualification from './AssumptionQualification.hook';


const AssumptionQualificationPage = () => {
  const theme = useTheme();
  const {
    container,
    setContainer,
    viewOnly,
    goToNextStep,
    isSaveLoading,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    handleSave,
    isAutoSaveFetching,
    assumptionQualificationData,
    isassumptionQualificationLoading,
  } = useAssumptionQualification();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title
        title=""
        customRender={
          <RowWrapper
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TextStyle
              variant="title1"
              weight={700}
              color={theme.palette.primary.main}
              py={1}
            >
              Asumsi dan Kualifikasi
            </TextStyle>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.error.main}
            >
              *
            </TextStyle>
          </RowWrapper>
        }
        sx={{ justifyContent: 'start' }}
      />
      <TableDebtorInformation
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />

      <WordEditor
        id="assumptionQualificationDesc"
        container={container}
        isLoading={isassumptionQualificationLoading}
        setContainer={setContainer}
        initialValue={assumptionQualificationData?.description}
        isWordEditorEmpty={isWordEditorEmpty}
        setIsWordEditorEmpty={setIsWordEditorEmpty}
        isReadOnly={viewOnly}
      />

      <RowWrapper justifyContent="end" py={theme.spacing(3)} gap={theme.spacing(2)}>
        {viewOnly ? (
          <Button
            onClick={goToNextStep}
            isLoading={isSaveLoading}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleSave({ goToNext: false })}
              isLoading={isSaveLoading}
              disabled={isWordEditorEmpty?.assumptionQualificationDesc || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={() => handleSave({ goToNext: true })}
              isLoading={isSaveLoading}
              disabled={isWordEditorEmpty?.assumptionQualificationDesc}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};


export default AssumptionQualificationPage;
