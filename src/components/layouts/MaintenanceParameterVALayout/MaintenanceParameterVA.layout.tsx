'use client';
import { usePathname } from 'next/navigation';

import BaseContainer from '@/components/shared/BaseContainer';

import CustomNavMenu from './components/CustomNavMenu/CustomNavMenu';
import { MaintenanceParameterVAProvider } from './MaintenanceParameterVA.context';


const MaintenanceParameterVALayout = ({ children }) => {
  const path = usePathname();

  return (
    <>
      <MaintenanceParameterVAProvider>
        <BaseContainer sx={{ gap: 2 }}>
          {
            (path.includes('/detail/') || path.includes('/edit/') || path.includes('/create/')) ? <CustomNavMenu /> : null
          }
          {children}
        </BaseContainer>
      </MaintenanceParameterVAProvider>
    </>
  );
};

export default MaintenanceParameterVALayout;
