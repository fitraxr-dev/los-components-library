import { useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export interface StepperConfig {
  steps: string[];
  stepPaths: string[];
  baseUrl: string;
}

export const useBarStepper = (config: StepperConfig) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStep = useMemo(() => {
    const pathSegments = pathname.split('/');
    const detailIndex = pathSegments.findIndex((segment) => segment === 'detail');
    const editIndex = pathSegments.findIndex((segment) => segment === 'edit');

    if (detailIndex >= 0 || editIndex >= 0) {
      const modeIndex = editIndex >= 0 ? editIndex : detailIndex;
      // For Bar routing: [id]/[processId]/[mode]/[submodule]/[code]/[description]/[step]
      // So step is at the last segment
      const lastSegment = pathSegments[pathSegments.length - 1];
      const stepIndex = config.stepPaths.findIndex((path) => path === lastSegment);
      return stepIndex >= 0 ? stepIndex : 0;
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
      if (moduleIndex >= 0) {
        // For Bar routing: [id]/[processId]/[mode]/[submodule]/[code]/[description]/[step]
        // Extract all parameters from current path
        const currentId = pathSegments[moduleIndex + 1];
        const processId = pathSegments[moduleIndex + 2];
        const mode = pathSegments[moduleIndex + 3];
        const submodule = pathSegments[moduleIndex + 4];
        const code = pathSegments[moduleIndex + 5];
        const description = pathSegments[moduleIndex + 6];

        // Construct new path with target step
        const basePath = `${config.baseUrl}/${currentId}/${processId}/${mode}/${submodule}/${code}/${description}`;
        const targetUrl = `${basePath}/${targetPath}`;
        const currentParams = new URLSearchParams(searchParams.toString());
        const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;

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
