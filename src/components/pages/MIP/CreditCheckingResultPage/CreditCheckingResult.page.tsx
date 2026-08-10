'use client';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import Debtor from './components/Debtor';
import Management from './components/Management';
import OtherRelated from './components/OtherRelated';
import Shareholder from './components/Shareholder';
import { CreditCheckingProvider } from './CreditCheckingResult.context';
import useCreditCheckingHook from './CreditCheckingResult.hook';


const CreditCheckingPage = () => {
  return (
    <CreditCheckingProvider>
      <CreditChecking />
    </CreditCheckingProvider>
  );
};

const CreditChecking = () => {
  const [state, _] = useApp();
  const { processId } = useIdentity();

  const {
    activeTab,
    bucketMasterId,
    setActiveTab,
    stepperStatus,
    stepperSteps,
  } = useCreditCheckingHook();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title=" Credit Rating Eksternal & Info Credit Checking" />
        <Tabs
          activeTab={activeTab}
          onChange={(val) => setActiveTab(+val)}
          items={[
            { label: 'Customer' },
            { label: 'Shareholder' },
            { label: 'Manajemen' },
            { label: 'Pihak Terkait Lainnya' },
          ]}
        />
        <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
        <TabItem activeValue={activeTab} value={0}>
          <Debtor />
        </TabItem>
        <TabItem activeValue={activeTab} value={1} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Shareholder />
        </TabItem>
        <TabItem activeValue={activeTab} value={2} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Management />
        </TabItem>
        <TabItem activeValue={activeTab} value={3} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <OtherRelated />
        </TabItem>
      </ColumnWrapper>
    </>
  );
};

export default CreditCheckingPage;
