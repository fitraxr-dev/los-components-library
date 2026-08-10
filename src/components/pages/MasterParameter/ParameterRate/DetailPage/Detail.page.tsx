'use client';

import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { capitalize } from '@/helpers/string';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import {
  MasterParameterTabPanel,
  MasterParameterTabs,
  MasterParameterTabsProvider,
} from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import TabProcess from './components/TabProcess';
import TabSummary from './components/TabSummary';
import TabValidation from './components/TabValidation';
import { TAB } from './Detail.constant';

import type { TabValue } from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';


const DetailPage = () => {
  const { processId, isViewOnly, mode, isChecker } = useMasterParameter();
  const { push, reset } = useBreadcrumbs();

  const [activeTab, setActiveTab] = React.useState<TabValue | undefined>(
    isChecker && !isViewOnly ? TAB.SUMMARY : TAB.PROCESS
  );

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-rate', label: 'Parameter Rate' });
    push({ href: `/${processId}/${mode}`, label: capitalize(mode) });
  }, [push, reset]);

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.PARAMETER_RATE,
    process: TypeProcess.PARAMETER_RATE,
  });

  const tabItems = React.useMemo(() => {
    const fallback = [
      { label: 'Process', value: TAB.PROCESS },
      { disabled: isViewOnly, label: 'Summary', value: TAB.SUMMARY },
      { disabled: isViewOnly, label: 'Validation', value: TAB.VALIDATION },
    ];

    const steps = stepperData?.steps;
    return Array.isArray(steps) && steps.length > 0 ? steps : fallback;
  }, [stepperData?.steps, isViewOnly]);

  return (
    <MasterParameterTabsProvider value={{ activeTab, setActiveTab }}>
      <MasterParameterTabs items={tabItems} />

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

export default DetailPage;
