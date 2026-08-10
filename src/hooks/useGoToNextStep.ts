import { usePathname, useSearchParams } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import useApp from './useApp';
import useViewOnly from './useViewOnly';


const useGoToNextStep = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { setViewOnly } = useViewOnly();

  function goToNextStep() {
    const pathArray = path.split('/');
    pathArray.splice(pathArray.length - 1, 1);

    const steps = stepper.steps;
    const lastPath = getLastPath(path);

    const stepIndex = steps.findIndex((step) => step.urlPath === lastPath);
    const nextStep = steps[stepIndex + 1]?.urlPath;
    let nextPath = `${pathArray.join('/')}/${nextStep}`;

    const isPreview = searchParams.get('isPreview');
    const fromPage = searchParams.get('fromPage');

    if (isPreview === 'true' || fromPage) {
      const queryParams = new URLSearchParams();

      if (isPreview === 'true') {
        queryParams.append('isPreview', 'true');
      }

      if (fromPage) {
        queryParams.append('fromPage', fromPage);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        nextPath = `${nextPath}?${queryString}`;
      }
    }

    const viewOnly = !steps.find((step) => step.urlPath === nextStep)?.enable;

    setViewOnly(viewOnly);
    router.push(nextPath);
  }

  return goToNextStep;
};

export default useGoToNextStep;
