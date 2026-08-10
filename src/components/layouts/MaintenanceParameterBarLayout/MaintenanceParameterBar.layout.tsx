'use client';
import { usePathname } from 'next/navigation';

import BaseContainer from '@/components/shared/BaseContainer';

import CustomNavMenu from './components/CustomNavMenu/CustomNavMenu';
import { MaintenanceParameterBarProvider } from './MaintenanceParameterBar.context';


const MaintenanceParameterBarLayout = ({ children }) => {
  const path = usePathname();

  return (
    <>
      <MaintenanceParameterBarProvider>
        <BaseContainer sx={{ gap: 2 }}>
          {
            (path.includes('/detail/') || path.includes('/edit/') || path.includes('/create/')) ? <CustomNavMenu /> : null
          }
          {children}
        </BaseContainer>
      </MaintenanceParameterBarProvider>
    </>
  );
};

export default MaintenanceParameterBarLayout;
