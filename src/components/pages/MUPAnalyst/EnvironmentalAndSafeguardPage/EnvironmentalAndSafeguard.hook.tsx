import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';


export const useEnvironmentalAndSafeguard = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);

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

  const handleNext = () => {
    if (activeTab === 0) {
      router.push(`${pathname}?tab=reporting-routine`);
      setActiveTab(1);
    } else {
      goToNextStep();
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      }]});
    }
  };

  return {
    activeTab,
    handleChangeTab,
    handleNext,
  };

};
