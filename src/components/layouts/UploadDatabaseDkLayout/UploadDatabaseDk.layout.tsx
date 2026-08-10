'use client';
import React from 'react';

import { usePathname } from 'next/navigation';

import { uploadDatabaseDk } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';

import { UploadDatabaseDkProvider } from './UploadDatabaseDk.context';


const UploadDatabaseDkLayout = ({ children }) => {
  const router = useCustomRouter();
  const path = usePathname();

  const isDetailPage = path?.includes('/upload-database-dk/detail/');
  const { redirectToFromPage } = useNavigationFromPage();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.replace(uploadDatabaseDk.LIST_PAGE);
  };

  return (
    <UploadDatabaseDkProvider>
      {isDetailPage && <BackButton handleClick={handleBack} />}
      <BaseContainer sx={{ gap: 2 }}>
        {children}
      </BaseContainer>
    </UploadDatabaseDkProvider>
  );
};

export default UploadDatabaseDkLayout;
