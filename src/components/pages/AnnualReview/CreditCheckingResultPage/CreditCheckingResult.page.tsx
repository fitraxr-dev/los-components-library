'use client';
import { TypeModule } from '@/enums/Module';
import useApp from '@/hooks/useApp';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

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
  const { typeProcess, isDepiDivision } = useAnnualReviewContext();

  const {
    activeTab,
    setActiveTab,
  } = useCreditCheckingHook();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDepiDivision && <ConfirmationLatest />}
        <Title title="Credit Checking Summary" />
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
        <TableDebtorInformation module={TypeModule.ANNUAL_REVIEW} process={typeProcess} />
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
