'use client';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useLegalBasis from './LegalBasis.hook';


const LegalBasisPage = () => {
  const theme = useTheme();
  const {
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isLegalBasisFetching,
    isSaveLoading,
    isWordEditorEmpty,
    legalBasisDetail,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  } = useLegalBasis();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title
        title=""
        customRender={
          <RowWrapper
            alignItems="center"
            justifyContent="space-between"
          >
            <TextStyle
              variant="title1"
              weight={700}
              color={theme.palette.primary.main}
              py={theme.spacing(1)}
            >
              Landasan Hukum
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
        id="legalBasisDesc"
        container={container}
        setContainer={setContainer}
        isLoading={isLegalBasisFetching}
        initialValue={legalBasisDetail?.description}
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
              disabled={isWordEditorEmpty?.legalBasisDesc || isAutoSaveFetching}
              isLoading={isSaveLoading}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={() => handleSave({ goToNext: true })}
              disabled={isWordEditorEmpty?.legalBasisDesc}
              isLoading={isSaveLoading}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );

};


export default LegalBasisPage;
