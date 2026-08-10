'use client';
import React, { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';

import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction/CorrectiveActionPlanForm';


const CorrectiveActionPlanForm = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;

  const path = usePathname();
  const pathArray = path.split('/');
  pathArray.splice(pathArray.length - 1, 1);

  const steps = stepper.steps;

  const viewOnly = useMemo(() => {
    return !steps.find((step) =>
      step.urlPath === pathArray.includes('edit') ? pathArray[pathArray.length - 1] : pathArray[pathArray.length - 2])?.enable;
  }, [appState]);

  return (
    <CorrectiveAction
      module={TypeModule.RISALAH_RAPAT}
      process={TypeProcess.RISALAH_RAPAT}
      viewOnly={viewOnly}
    />
  );
};

export default CorrectiveActionPlanForm;
