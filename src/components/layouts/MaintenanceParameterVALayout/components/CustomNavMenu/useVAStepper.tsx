import { useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export interface StepperConfig {
  steps: string[];
  stepPaths: string[];
  baseUrl: string;
}

export const useVAStepper = (config: StepperConfig) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStep = useMemo(() => {
    const pathSegments = pathname.split('/');

    // Check if we're in create mode (either /create/ or /{id}/{processId}/create/)
    const isCreateMode = pathname.includes('/create/');

    // Handle create flow
    if (isCreateMode) {
      for (let i = 0; i < config.stepPaths.length; i++) {
        if (pathname.includes(config.stepPaths[i])) {
          return i;
        }
      }
      return 0;
    }

    // Handle detail/edit flow
    const editIndex = pathSegments.findIndex((segment) => segment === 'edit');
    const detailIndex = pathSegments.findIndex((segment) => segment === 'detail');

    if (editIndex >= 0 || detailIndex >= 0) {
      const modeIndex = editIndex >= 0 ? editIndex : detailIndex;

      if (modeIndex + 1 < pathSegments.length) {
        const currentPath = pathSegments[modeIndex + 1];
        const stepIndex = config.stepPaths.findIndex((path) => path === currentPath);
        return stepIndex >= 0 ? stepIndex : 0;
      }
    }

    // Fallback
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
        // Check if we're in create mode
        const isCreateMode = currentId === 'create' || pathname.includes('/create/');

        if (isCreateMode) {
          // For create mode, check if we have bucketProcessId
          if (currentId === 'create') {
            // Initial create mode without bucketProcessId
            const basePath = `${config.baseUrl}/create`;
            const targetUrl = `${basePath}/${targetPath}`;
            const currentParams = new URLSearchParams(searchParams.toString());
            const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;
            router.push(finalUrl);
          } else {
            // Create mode with bucketProcessId (after save)
            const processId = moduleIndex >= 0 ? pathSegments[moduleIndex + 2] : null;
            const basePath = `${config.baseUrl}/${currentId}/${processId}/create`;
            const targetUrl = `${basePath}/${targetPath}`;
            const currentParams = new URLSearchParams(searchParams.toString());
            const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;
            router.push(finalUrl);
          }
        } else if (currentId && currentId.trim() !== '' && currentId !== '%20') {
          // Check if we're in edit mode by looking at the current pathname
          const isEditMode = pathname.includes('/edit/');

          // Get the processId (bucketProcessId) from the URL
          const processId = moduleIndex >= 0 ? pathSegments[moduleIndex + 2] : null;

          // For edit/detail mode, use /edit/ or /detail/ based on current mode
          const modePath = isEditMode ? 'edit' : 'detail';
          const basePath = `${config.baseUrl}/${currentId.trim()}/${processId || 'null'}/${modePath}`;
          const targetUrl = `${basePath}/${targetPath}`;
          const currentParams = new URLSearchParams(searchParams.toString());
          const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;

          router.push(finalUrl);
        } else {
          // Fallback to create if no valid currentId
          const basePath = `${config.baseUrl}/create`;
          const targetUrl = `${basePath}/${targetPath}`;
          const currentParams = new URLSearchParams(searchParams.toString());
          const finalUrl = currentParams.toString() ? `${targetUrl}?${currentParams.toString()}` : targetUrl;

          router.push(finalUrl);
        }
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
