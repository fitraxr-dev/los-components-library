import { usePathname, useSearchParams } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';


const useGoToNextStepParameterBar = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToNextStep() {
    const pathArray = pathname.split('/');
    const lastPath = pathArray[pathArray.length - 1];

    // Check if this is isChecker from approval-list (should only show summary and validasi)
    let stepSequence = ['process', 'summary', 'validasi'];
    try {
      const stored = sessionStorage.getItem('maintenanceParameterBarNavigation');
      if (stored) {
        const parsed = JSON.parse(stored);
        // If it's from approval-list and not viewOnly (WAITING_APPROVAL_CHECKER), use limited sequence
        if (parsed.source === 'approval-list' && !parsed.isViewOnly) {
          stepSequence = ['summary', 'validasi'];
        }
      }
    } catch (error) {
      // Ignore parsing errors, use default sequence
    }

    // Find current step index
    const currentStepIndex = stepSequence.findIndex((step) => step === lastPath);

    if (currentStepIndex === -1) {
      console.error('Current step not found in sequence:', lastPath);
      return;
    }

    // Get next step
    const nextStep = stepSequence[currentStepIndex + 1];

    if (!nextStep) {
      console.error('No next step available');
      return;
    }

    // Construct next path - preserve edit/detail mode
    pathArray[pathArray.length - 1] = nextStep;
    const nextPath = pathArray.join('/');

    // Preserve search params
    const finalPath = searchParams.toString()
      ? `${nextPath}?${searchParams.toString()}`
      : nextPath;

    router.push(finalPath);
  }

  return goToNextStep;
};

export default useGoToNextStepParameterBar;
