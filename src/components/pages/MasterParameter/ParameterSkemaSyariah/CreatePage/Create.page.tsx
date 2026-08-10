'use client';

import * as React from 'react';

import { useSearchParams } from 'next/navigation';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import {
  MasterParameterTabPanel,
  MasterParameterTabs,
  MasterParameterTabsProvider,
} from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';

import { TAB } from '../CommonComponent/TabMenu.constant';
import useParameterSyariahMode from '../hooks/useParameterSyariahMode';

import TabProcess from './components/TabProcess';
import TabSummary from './components/TabSummary';
import TabValidation from './components/TabValidation';

import type {
  MasterParameterTabItems,
  TabValue,
} from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';


const CreatePage = () => {
  const { isSubmission, isViewOnly, isMaker, isChecker, processId, mode } = useParameterSyariahMode();
  const searchParams = useSearchParams();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-skema-syariah', label: 'Parameter Skema Syariah' });

    // Determine label based on mode
    const label = mode === 'submission' ? 'Edit'
      : mode === 'detail' ? 'Detail'
        : mode === 'edit' ? 'Edit'
          : 'Create';

    push({ href: `/${processId}/${mode === 'submission' ? 'submission' : mode === 'detail' ? 'detail' : mode === 'edit' ? 'edit' : 'create'}`, label });
  }, [push, reset, processId, mode]);

  // Get tab from URL query parameter, fallback to default
  const tabFromUrl = searchParams?.get('tab');
  const defaultTab = tabFromUrl && Object.values(TAB).includes(tabFromUrl)
    ? tabFromUrl
    : (isSubmission ? TAB.SUMMARY : TAB.PROCESS);

  const [activeTab, setActiveTab] = React.useState<TabValue>(defaultTab);
  const handleTabChange = (val: TabValue) => setActiveTab(val);

  // Update active tab when URL parameter changes
  React.useEffect(() => {
    if (tabFromUrl && Object.values(TAB).includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const tabItems: MasterParameterTabItems = React.useMemo(() => {
    const items: MasterParameterTabItems = [];

    if (!isSubmission || (isSubmission && isMaker)) {
      items.push({
        label: 'Process',
        value: TAB.PROCESS,
      });
    }

    items.push({
      disabled: isViewOnly,
      label: 'Summary',
      value: TAB.SUMMARY,
    });

    items.push({
      disabled: isViewOnly,
      label: 'Validation',
      value: TAB.VALIDATION,
    });

    return items;
  }, [isSubmission, isViewOnly, isMaker, isChecker]);

  return (
    <MasterParameterTabsProvider value={{ activeTab, setActiveTab }}>
      <MasterParameterTabs
        items={tabItems}
      />

      <MasterParameterTabPanel value={TAB.PROCESS}>
        <TabProcess />
      </MasterParameterTabPanel>

      <MasterParameterTabPanel value={TAB.SUMMARY}>
        <TabSummary />
      </MasterParameterTabPanel>

      <MasterParameterTabPanel value={TAB.VALIDATION}>
        <TabValidation />
      </MasterParameterTabPanel>
    </MasterParameterTabsProvider>
  );
};

export default CreatePage;
