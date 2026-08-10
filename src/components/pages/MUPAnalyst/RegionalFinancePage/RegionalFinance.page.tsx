'use client';

import { useTheme } from '@mui/material';

import { TypeProcess, TypeModule } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useRegionalFinance } from './RegionalFinance.hook';


const RegionalFinancePage = () => {
  const {
    regionalFinanceDetail,
    isFetchLoading,
    isSaveLoading,
    handleSave,
    goToNextStep,
    container,
    setContainer,
    viewOnly,
    renderActionButtons,
  } = useRegionalFinance();

  const theme = useTheme();

  const renderButton = () => {
    if (viewOnly) {
      return (
        <Button onClick={goToNextStep}>
          Next
        </Button>
      );
    } else {
      return (
        <>
          <Button
            isLoading={isSaveLoading}
            onClick={handleSave}
          >
            Save
          </Button>
          {...renderActionButtons()}
        </>
      );
    }
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Keuangan Daerah" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />

      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={regionalFinanceDetail?.description}
        onSave={handleSave}
      />

      <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
        {renderButton()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default RegionalFinancePage;
