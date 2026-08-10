import { useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export interface StepperConfig {
  steps: string[];
  stepPaths: string[];
  baseUrl: string;
}

export const useGlobalStepper = (config: StepperConfig) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStep = useMemo(() => {
    const pathSegments = pathname.split('/');
    const detailIndex = pathSegments.findIndex((segment) => segment === 'detail');

    if (detailIndex >= 0) {
      const moduleName = config.baseUrl.split('/').pop();

      if (moduleName === 'parameter-mapping-bar') {
        if (detailIndex + 2 < pathSegments.length) {
          const currentPath = pathSegments[detailIndex + 2];
          const stepIndex = config.stepPaths.findIndex((path) => path === currentPath);
          return stepIndex >= 0 ? stepIndex : 0;
        }
      } else {
        if (detailIndex + 1 < pathSegments.length) {
          const currentPath = pathSegments[detailIndex + 1];
          const stepIndex = config.stepPaths.findIndex((path) => path === currentPath);
          return stepIndex >= 0 ? stepIndex : 0;
        }
      }
    }

    for (let i = 0; i < config.stepPaths.length; i++) {
      if (pathname.includes(config.stepPaths[i])) {
        return i;
      }
    }

    return 0;
  }, [pathname, config.stepPaths]);

  const getSubModule = (pathSegments: string[]) => {
    // First, try to get subModule from sessionStorage
    try {
      const stored = sessionStorage.getItem('maintenanceParameterBarNavigation');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.subModule) {
          return parsed.subModule;
        }
      }
    } catch (error) {
      // Ignore parsing errors
    }

    // Fallback: extract subModule from current path
    const detailIndex = pathSegments.findIndex((segment) => segment === 'detail');
    const editIndex = pathSegments.findIndex((segment) => segment === 'edit');
    const modeIndex = editIndex >= 0 ? editIndex : detailIndex;

    if (modeIndex >= 0 && modeIndex + 1 < pathSegments.length) {
      const nextSegment = pathSegments[modeIndex + 1];
      if (!['process', 'summary', 'validasi'].includes(nextSegment)) {
        return nextSegment;
      }
    }

    // Additional fallback: try to get from URL params if available
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const subModuleFromUrl = urlParams.get('subModule');
      if (subModuleFromUrl) {
        return subModuleFromUrl;
      }
    } catch (error) {
      // Ignore URL parsing errors
    }

    return '';
  };

  const handleStepClick = (stepIndex: number) => {
    const targetPath = config.stepPaths[stepIndex];
    if (targetPath) {
      const pathSegments = pathname.split('/');
      const baseUrlSegments = config.baseUrl.split('/');
      const moduleName = baseUrlSegments[baseUrlSegments.length - 1];
      const moduleIndex = pathSegments.findIndex((segment) => segment === moduleName);
      const currentId = moduleIndex >= 0 ? pathSegments[moduleIndex + 1] : null;

      if (currentId) {
        const subModule = moduleName === 'parameter-mapping-bar' ? getSubModule(pathSegments) : '';

        // Check if we're in edit mode by looking at the current pathname
        const isEditMode = pathname.includes('/edit/');
        const mode = isEditMode ? 'edit' : 'detail';

        const basePath = `${config.baseUrl}/${currentId}/${mode}${subModule ? `/${subModule}` : ''}`;
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
