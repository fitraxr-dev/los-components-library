'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useOverview = () => {
  const router = useRouter();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.back();
  };

  const pathSegments = path.split('/').filter(Boolean);
  const isDetailPage = pathSegments.length > 2;
  const isCreationPage = path.includes('/create');

  const renderDetailLayout = isDetailPage && !isCreationPage;

  return {
    handleBack,
    isCreationPage,
    isDetailPage,
    renderDetailLayout,
  };
};

export default useOverview;
