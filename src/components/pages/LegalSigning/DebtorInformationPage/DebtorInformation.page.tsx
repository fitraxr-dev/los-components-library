'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import BusinessGroupSection from './components/BusinessGroupSection';
import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TItleDebtor/TitleDebtor';


const DebtorInformation = () => {

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <TitleDebtor />
      <TableDebtorInformation
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.LEGAL_SIGNING}
      />
      <DetailDebtorSection />
      <BusinessGroupSection />
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformation;
