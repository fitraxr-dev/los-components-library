'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertRisalahRapat from '@/components/shared/SmiComponent/AlertRisalahRapat';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import BusinessGroupSection from './components/BusinessGroupSection';
import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TItleDebtor/TitleDebtor';


const DebtorInformation = () => {
  const { processId } = useIdentity();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertRisalahRapat
        bucketProcessId={processId}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        refetchInterval={false}
      />
      <TitleDebtor />
      <TableDebtorInformation
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        showSubtitle={false}
      />
      <DetailDebtorSection />
      <BusinessGroupSection />
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformation;
