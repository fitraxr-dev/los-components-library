import { useContext, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';


const useShariaComplianceAspect = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { processId } = useIdentity();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { setActiveTab: setActiveTabCtx, goToNextStep } = useMUPAnalystContext();

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'internal-concern') {
      setActiveTab(0);
    } else if (tab === 'external-concern') {
      setActiveTab(1);
    }
  }, []);

  const handleChangeTab = (val: number) => {
    if (!!dirtyMsg) {
      const isConfirmed = window.confirm('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');

      if (isConfirmed) {
        setActiveTab(val);
        setActiveTabCtx(val);
        setDirtyMsg(undefined);
      }
    }
    else {
      setActiveTab(val);
      setActiveTabCtx(val);
    }

    if (val === 0) {
      router.push(`${pathname}?tab=internal-concern`);
    } else if (val === 1) {
      router.push(`${pathname}?tab=external-concern`);
    }
  };

  const handleNext = () => {
    if (activeTab === 0) {
      router.push(`${pathname}?tab=external-concern`);
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

export default useShariaComplianceAspect;
