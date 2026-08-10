'use client';

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
  } = useRegionalFinance();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Keuangan Daerah" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <WordEditor
        isReadOnly
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={regionalFinanceDetail?.description}
        onSave={handleSave}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          onClick={
            goToNextStep
          }
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default RegionalFinancePage;
