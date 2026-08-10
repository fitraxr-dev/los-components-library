import { usePathname, useSearchParams } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';


const useGoToNextStepParameterVA = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToNextStep() {
    const pathArray = pathname.split('/');
    const lastPath = pathArray[pathArray.length - 1];

    // Define step sequence for parameter-va
    const stepSequence = ['process', 'summary', 'validasi'];

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

    // Construct next path
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

export default useGoToNextStepParameterVA;
