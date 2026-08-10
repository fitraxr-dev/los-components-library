'use client';

import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TabDiscussion from './components/TabDiscussion';
import TabVerificationResult from './components/TabVerificationResult';
import { TAB, TAB_ITEMS } from './FinancingCommittee.constants';


const FinancingCommittee = () => {
  const [activeTab, setActiveTab] = React.useState(TAB.PEMBAHASAN);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Pembahasan dan Hasil Verifikasi" />

      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => setActiveTab(val)}
        items={TAB_ITEMS}
      />
      <TabItem activeValue={activeTab} value={TAB.PEMBAHASAN}>
        <TabDiscussion />
      </TabItem>

      <TabItem activeValue={activeTab} value={TAB.HASIL_VERIFIKASI}>
        <TabVerificationResult />
      </TabItem>
    </ColumnWrapper>
  );
};

export default FinancingCommittee;
