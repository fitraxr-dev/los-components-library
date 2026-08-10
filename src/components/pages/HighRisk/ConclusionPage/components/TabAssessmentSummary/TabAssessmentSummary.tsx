import { Box, useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { tab } from '../../Conclusion.constants';

import TableDocumentVerification from './components/TableDocumentVerification';
import useAssessmentSummary from './TabAssessmentSummary.hook';


const TabAssessmentSummary = ({ handleNextTab }: {handleNextTab: (tab: string) => void}) => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const {
    conclusionData,
    container,
    handleSave,
    isAutoSaveFetching,
    isCustomerDueListLoading,
    isDetailConclusionLoading,
    isSaveLoading,
    isSummaryHighRisk,
    setContainer,
    setIsSummaryHighRisk,
    tableData,
    tableHeadChildVerif,
    tableHeadGrandChildVerif,
    tableHeader,
  } = useAssessmentSummary({ handleNextTab });

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <BaseContainer>
        <TableDocumentVerification
          isLoading={isCustomerDueListLoading || isDetailConclusionLoading}
          tableData={tableData}
          tableHeaderChild={tableHeadChildVerif}
          tableHeaderGrandChild={tableHeadGrandChildVerif}
          tableHeader={tableHeader}
          maxHeight="100vh"
        />
      </BaseContainer>
      <Box>
        <Title title="Summary High Risk" sx={{ fontSize: '1.66667vw' }} />
        <Input
          type="radio"
          value={isSummaryHighRisk}
          disabled={viewOnly}
          onChange={(e) => setIsSummaryHighRisk(e.target.value) }
          radioList={[
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]}
        />
      </Box>

      <SectionTitle title="Keterangan" isOpen>
        <WordEditor
          isLoading={isDetailConclusionLoading}
          isReadOnly={viewOnly}
          initialValue={conclusionData?.description}
          container={container}
          setContainer={setContainer}
          paperProps={{ sx: { mt: theme.spacing(3) } }}
        />
      </SectionTitle>

      <RowWrapper justifyContent="end" paddingY={theme.spacing(3)} gap={theme.spacing(2)}>
        {viewOnly ? (
          <Button
            onClick={() => handleNextTab(tab.ADDITIONAL_INFORMATION)}
            isLoading={isSaveLoading}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleSave({ goToNext: false })}
              isLoading={isSaveLoading}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={() => handleSave({ goToNext: true })}
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

export default TabAssessmentSummary;
