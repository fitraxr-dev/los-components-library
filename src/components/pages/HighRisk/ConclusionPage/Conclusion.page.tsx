'use client';

import { TypeProcess, TypeModule } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TabAdditionalInformation from './components/TabAdditionalInformation';
import TabAssessmentSummary from './components/TabAssessmentSummary';
import TabCDDImplementation from './components/TabCDDImplementation';
import { tab, TAB_ITEMS } from './Conclusion.constants';
import { ConclusionProvider } from './Conclusion.context';
import { useConclusion } from './Conclusion.hook';


const ConclusionPage = () => {
  const {
    activeTab,
    handleChangeTab,
  } = useConclusion();

  return (
    <ConclusionProvider>
      <ColumnWrapper sx={{ gap: 3, height: '100%' }}>
        <Title title="Kesimpulan" />
        <TableDebtorInformation
          module={TypeModule.HIGH_RISK}
          process={TypeProcess.HIGH_RISK_DK}
        />

        <Tabs
          activeTab={activeTab}
          onChange={handleChangeTab}
          items={TAB_ITEMS}
        />

        <TabItem activeValue={activeTab} value={tab.SUMMARY}>
          <TabAssessmentSummary handleNextTab={handleChangeTab} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.CDD_IMPLEMENTATION}>
          <TabCDDImplementation handleNextTab={handleChangeTab} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.ADDITIONAL_INFORMATION}>
          <TabAdditionalInformation />
        </TabItem>
      </ColumnWrapper>
    </ConclusionProvider>
  );
};


export default ConclusionPage;
