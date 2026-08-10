import { usePathname, useRouter } from 'next/navigation';

import { siteVisit } from '@/configs/constants/pathname';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [siteVisit.LIST_PAGE];

const useSiteVisit = () => {
  const router = useRouter();
  const path = usePathname();

  const isDetailPage = !ignorePath.includes(path);
  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    if (redirectToFromPage()) return;
    isDetailPage ? router.push(siteVisit.LIST_PAGE) : router.back();
  };

  const shouldRenderStepper = isDetailPage;

  return {
    handleBack,
    shouldRenderStepper,
  };
};

export default useSiteVisit;
