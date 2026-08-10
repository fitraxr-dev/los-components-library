'use client';

import { usePathname, useRouter } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const UseReport = () => {
  const router = useRouter();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.back();
  };

  // Check if current path is a detail page (more than 2 segments)
  const pathSegments = path.split('/').filter((segment) => segment !== '');

  // Whitelist for paths that need more segments to be considered detail pages
  const whitelist = ['laporan-customer', 'bmpp'];

  // Check if the second segment (index 1) is in the whitelist
  const isWhitelistedPath = pathSegments.length > 1 && whitelist.includes(pathSegments[1]);

  // Adjust segment length check based on whitelist
  const isDetailPage = isWhitelistedPath ? pathSegments.length > 3 : pathSegments.length > 2;
  const isCreationPage = path.includes('/create');

  const renderDetailLayout = isDetailPage && !isCreationPage;

  return {
    handleBack,
    isCreationPage,
    renderDetailLayout,
  };
};

export default UseReport;
