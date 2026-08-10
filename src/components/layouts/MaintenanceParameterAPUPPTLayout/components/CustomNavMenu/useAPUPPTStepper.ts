import { useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export interface StepperConfig {
  steps: string[];
  stepPaths: string[];
  baseUrl: string;
}

export const useAPUPPTStepper = (config: StepperConfig) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
      const currentId = moduleIndex >= 0 ? pathSegments[moduleIndex + 1] : null;

      if (currentId) {
        // Check if we're in edit mode by looking at the current pathname
        const isEditMode = pathname.includes('/edit/');
        const mode = isEditMode ? 'edit' : 'detail';

        // For parameter-mapping-apu_ppt, preserve processId if it exists
        let basePath = `${config.baseUrl}/${currentId}/${mode}`;

        // Check if there's a processId in the current path (should be after currentId and before mode)
        const processIdIndex = pathSegments.findIndex((segment, index) =>
          index > moduleIndex + 1 && index < pathSegments.findIndex((s) => s === mode) &&
          !['process', 'summary', 'validasi'].includes(segment)
        );


        if (processIdIndex >= 0) {
          const processId = pathSegments[processIdIndex];
          basePath = `${config.baseUrl}/${currentId}/${processId}/${mode}`;
          console.log('processId found:', processId);
        }

        const targetUrl = `${basePath}/${targetPath}`;
        const currentParams = new URLSearchParams(searchParams.toString());
        const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;

        console.log('finalUrl:', finalUrl);
        console.log('=== APUPPT STEPPER DEBUG END ===');

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
