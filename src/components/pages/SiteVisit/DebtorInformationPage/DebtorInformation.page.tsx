'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import DebtorDetailSection from './components/DebtorDetailSection';
import GroupSection from './components/GroupSection';
import SaveButton from './components/SaveButton';
import TypeSection from './components/TypeSection';
import { DebtorInformationProvider } from './DebtorInformation.context';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {

  const { isPemda } = useDebtorInformation();

  return (
    <DebtorInformationProvider>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Informasi Customer" />
        <TableDebtorInformation module={TypeModule.SITE_VISIT} process={TypeProcess.SITE_VISIT} />
        {/* { isPemda && <TypeSection /> } */}
        <DebtorDetailSection />
        { !isPemda && <TableBusinessGroup module={TypeModule.SITE_VISIT} process={TypeProcess.SITE_VISIT} /> }
        <SaveButton />
      </ColumnWrapper>
    </DebtorInformationProvider>
  );
};

export default DebtorInformationPage;
