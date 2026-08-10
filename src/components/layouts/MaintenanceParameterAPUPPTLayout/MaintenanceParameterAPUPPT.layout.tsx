'use client';
import { usePathname } from 'next/navigation';

import BaseContainer from '@/components/shared/BaseContainer';

import CustomNavMenu from './components/CustomNavMenu/CustomNavMenu';
import { MaintenanceParameterAPUPPTProvider } from './MaintenanceParameterAPUPPT.context';


const MaintenanceParameterAPUPPTLayout = ({ children }) => {
  const path = usePathname();

  // More specific condition for preview
  const isPreviewPage = path.endsWith('/preview') || path.includes('/preview/');

  // Explicitly exclude preview pages
  if (isPreviewPage) {
    return (
      <MaintenanceParameterAPUPPTProvider>
        <BaseContainer sx={{ gap: 2 }}>
          {children}
        </BaseContainer>
      </MaintenanceParameterAPUPPTProvider>
    );
  }

  const shouldShowStepper = (path.includes('/detail/') || path.includes('/edit/') || path.includes('/create/')) && !path.includes('/add-group');

  return (
    <MaintenanceParameterAPUPPTProvider>
      <BaseContainer sx={{ gap: 2 }}>
        {shouldShowStepper ? <CustomNavMenu /> : null}
        {children}
      </BaseContainer>
    </MaintenanceParameterAPUPPTProvider>
  );
};

export default MaintenanceParameterAPUPPTLayout;
