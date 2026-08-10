import { useContext, useEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


export const useEnvironmentalAndSafeguard = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const [state] = useApp();
  const _module = state.pages.mipModule;
  const process = state.pages.mipProcess;
  const { viewOnly } = useViewOnly();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const goToNextStep = useGoToNextStep();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [activeTab, setActiveTab] = useState(0);

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  useEffect(() => {
    router.push(`${pathname}?tab=corrective-action-plan`);
  }, []);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'reporting-routine') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);


  const handleChangeTab = (val: number) => {
    if (val === 0) {
      router.push(`${pathname}?tab=corrective-action-plan`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=reporting-routine`);
    }
  };

  return {
    activeTab,
    handleChangeTab,
    module: _module,
    process,
    processId,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    viewOnly,
  };

};
