'use client';
import React, { useState, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';


import { TypeModule, TypeProcess } from '@/enums/Module';

import Tabs, { TabItem } from '@/components/shared/Tabs';

import ChildLimit from '../ChildLimit';
import ParentLimit from '../ParentLimit';

import { tab, tabItems } from './ParentChildLimit.constant';


const ParentChildLimitPage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(tab.CHILD_LIMIT);

  const facilityId = searchParams.get('facilityId');
  const recordId = searchParams.get('id');
  const financingFacilityId = searchParams.get('financingFacilityId');
  const parentSyariahLimitId = searchParams.get('parentSyariahLimitId');
  // const isLpsMode = searchParams.get('lpsMode');
  const createNew = searchParams.get('createNew') === 'true' || searchParams.get('createNewLps') === 'true';


  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  const handleGoToChildLimit = () => {
    setActiveTab(tab.CHILD_LIMIT);
  };

  return (
    <>
      <Tabs
        activeTab={activeTab}
        onChange={searchParams.toString() !== '' && (!createNew || !!parentSyariahLimitId) ? handleChangeTab : undefined}
        items={tabItems}
      />

      <TabItem activeValue={activeTab} value={tab.CHILD_LIMIT}>
        <ChildLimit
          module={TypeModule.ENGAGEMENT_AGREEMENT}
          process={TypeProcess.ENGAGEMENT_AGREEMENT}
          facilityId={facilityId}
          financingFacilityId={financingFacilityId ? Number(financingFacilityId) : null}
          setActiveTab={setActiveTab}
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.PARENT_LIMIT}>
        <ParentLimit
          facilityId={facilityId}
          recordId={recordId}
          financingFacilityId={financingFacilityId}
          onNextTab={handleGoToChildLimit}
        />
      </TabItem>


    </>
  );
};

export default ParentChildLimitPage;
