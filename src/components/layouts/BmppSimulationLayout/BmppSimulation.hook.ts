import { usePathname } from 'next/navigation';

import { bmppSimulation } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignoreBackButton = [
  bmppSimulation.BUCKET_LIST_PAGE
];

const useBmppSimulationLayout = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const { redirectToFromPage } = useNavigationFromPage();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.replace(bmppSimulation.BUCKET_LIST_PAGE);
  };

  const withBackButton = !ignoreBackButton.includes(pathname);

  return {
    handleBack,
    withBackButton,
  };
};

export default useBmppSimulationLayout;
