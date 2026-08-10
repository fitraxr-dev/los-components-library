import { useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';


export interface StepperConfig {
  steps: string[];
  stepPaths: string[];
  baseUrl: string;
}

export const useLOVStepper = (config: StepperConfig) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recordActivity } = useRecordLog();

  const currentStep = useMemo(() => {
    const pathSegments = pathname.split('/');
    const detailIndex = pathSegments.findIndex((segment) => segment === 'detail');
    const editIndex = pathSegments.findIndex((segment) => segment === 'edit');

    if (detailIndex >= 0 || editIndex >= 0) {
      const modeIndex = editIndex >= 0 ? editIndex : detailIndex;
      if (modeIndex + 1 < pathSegments.length) {
        const currentPath = pathSegments[modeIndex + 1];
        const stepIndex = config.stepPaths.findIndex((path) => path === currentPath);
        return stepIndex >= 0 ? stepIndex : 0;
      }
    }

    for (let i = 0; i < config.stepPaths.length; i++) {
      if (pathname.includes(config.stepPaths[i])) {
        return i;
      }
    }

    return 0;
  }, [pathname, config.stepPaths]);

  const handleStepClick = (stepIndex: number) => {
    const targetPath = config.stepPaths[stepIndex];
    if (targetPath) {
      const pathSegments = pathname.split('/');
      const baseUrlSegments = config.baseUrl.split('/');
      const moduleName = baseUrlSegments[baseUrlSegments.length - 1];
      const moduleIndex = pathSegments.findIndex((segment) => segment === moduleName);

      // Extract all parameters from current URL
      const currentId = moduleIndex >= 0 ? pathSegments[moduleIndex + 1] : null;
      const processId = moduleIndex >= 0 && pathSegments[moduleIndex + 2] ? pathSegments[moduleIndex + 2] : null;
      const description = moduleIndex >= 0 && pathSegments[moduleIndex + 3] ? pathSegments[moduleIndex + 3] : null;
      const moduleParam = moduleIndex >= 0 && pathSegments[moduleIndex + 4] ? pathSegments[moduleIndex + 4] : null;

      console.log('=== LOV STEPPER DEBUG ===');
      console.log('pathname:', pathname);
      console.log('pathSegments:', pathSegments);
      console.log('currentId:', currentId);
      console.log('processId:', processId);
      console.log('description:', description);
      console.log('module:', moduleParam);
      console.log('targetPath:', targetPath);

      if (currentId && processId && description && moduleParam) {
        // Check if we're in edit mode by looking at the current pathname
        const isEditMode = pathname.includes('/edit/');
        const mode = isEditMode ? 'edit' : 'detail';

        // Get current step name and target step name
        const currentStepName = config.steps[currentStep] || 'unknown';
        const targetStepName = config.steps[stepIndex] || 'unknown';

        // Record activity for stepper navigation
        recordActivity({
          activity: ActivityType.VIEW,
          bucketProcessId: processId,
          menuCode: 'parameter-lov',
          module: moduleParam,
          process: 'parameter-lov',
          remarks: `navigate from ${currentStepName} to ${targetStepName} step in parameter lov: ${description}`,
        });

        // Build the full URL with all parameters
        const baseUrl = `${config.baseUrl}/${currentId}/${processId}/${description}/${moduleParam}/${mode}`;
        const targetUrl = `${baseUrl}/${targetPath}`;
        const currentParams = new URLSearchParams(searchParams.toString());
        const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;

        console.log('finalUrl:', finalUrl);
        console.log('=== LOV STEPPER DEBUG END ===');

        router.push(finalUrl);
      }
    }
  };

  const isStepActive = (stepIndex: number) => {
    return stepIndex === currentStep;
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < currentStep;
  };

  return {
    currentStep,
    handleStepClick,
    isStepActive,
    isStepCompleted,
    stepPaths: config.stepPaths,
    steps: config.steps,
  };
};
