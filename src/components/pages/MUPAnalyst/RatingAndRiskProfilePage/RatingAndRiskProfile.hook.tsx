import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';


export const useRatingAndRiskProfilePage = () => {
  const { goToNextStep } = useMUPAnalystContext();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tab = searchParams?.get('tab');

    if (tab === 'risk-profile') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  const handleChangeTab = (val: number) => {
    if (val === 0) {
      router.push(`${pathname}?tab=rating`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=risk-profile`);
    }
  };

  const handleNext = () => {
    if (activeTab === 0) {
      router.push(`${pathname}?tab=risk-profile`);

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
