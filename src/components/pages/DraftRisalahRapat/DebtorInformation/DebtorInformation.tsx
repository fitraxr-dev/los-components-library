'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import BusinessGroupSection from './components/BusinessGroupSection';
import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TitleDebtor';


const DebtorInformation = () => {

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <TitleDebtor />
      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />
      <DetailDebtorSection />
      <BusinessGroupSection />
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformation;
