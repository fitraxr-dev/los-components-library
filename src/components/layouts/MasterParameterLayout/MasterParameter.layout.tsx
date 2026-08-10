'use client';

import * as React from 'react';

import { usePathname } from 'next/navigation';

import BaseContainer from '@/components/shared/BaseContainer';

import Breadcrumbs from './components/Breadcrumbs';
import { BreadcrumbsProvider } from './components/Breadcrumbs/Breadcrumbs.context';


const DEFAULT_CRUMB = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Master Parameter',
    url: '/master-parameter',
  }
];

const MasterParameterLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  const pathname = usePathname();

  return (
    <BreadcrumbsProvider initialItems={DEFAULT_CRUMB}>
      <Breadcrumbs />
      <BaseContainer sx={{ pb: 5 }}>
        {children}
      </BaseContainer>
    </BreadcrumbsProvider>
  );
};

export default MasterParameterLayout;
