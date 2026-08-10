'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformationVa from '@/components/shared/SmiTable/TableDebtorInformationVa';
import Title from '@/components/shared/Title';

import DebtorDetailSection from './components/DebtorDetailSection';
import GroupSection from './components/GroupSection';
import SaveButton from './components/SaveButton';
import { DebtorInformationProvider } from './DebtorInformation.context';


const DebtorInformationPage = () => {

  return (
    <DebtorInformationProvider>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Informasi Customer" />
        <TableDebtorInformationVa module={TypeModule.VA_CREATION} process={TypeProcess.VA_CREATION} />
        {/* //TODO FOR PEMDA SITE VISIT */}
        {/* <TypeSection /> */}
        <DebtorDetailSection />
        <GroupSection />
        <SaveButton />
      </ColumnWrapper>
    </DebtorInformationProvider>
  );
};

export default DebtorInformationPage;
