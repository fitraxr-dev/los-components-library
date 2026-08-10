import { useState } from 'react';

import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';


const useShariaComplianceAspect = () => {
  const { processId } = useIdentity();
  const [state] = useApp();
  const [activeTab, setActiveTab] = useState('internal');

  const tab = {
    EXTERNAL: 'external',
    INTERNAL: 'internal',
  };

  const tabItems = [
    {
      label: 'Internal Concern',
      value: tab.INTERNAL,
    },
    {
      label: 'External Concern',
      value: tab.EXTERNAL,
    }
  ];

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  return {
    activeTab,
    handleChangeTab,
    processId,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    tab,
    tabItems,
  };
};

export default useShariaComplianceAspect;
