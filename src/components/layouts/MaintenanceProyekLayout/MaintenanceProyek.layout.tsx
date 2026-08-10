'use client';
import BaseContainer from '@/components/shared/BaseContainer';
import Progress from '@/components/shared/Progress';
import Stepper from '@/components/shared/Stepper';

import BreadCrumb from './components/BreadCrumb';
import CustomNavMenu from './components/CustomNavMenu';
import CustomStepper from './components/CustomStepper';
import { MaintenanceProyekProvider } from './MaintenanceProyek.context';
import useMaintenanceProyek from './MaintenanceProyek.hook';


const MaintenanceProyekLayout = ({ children }) => {
  const {
    renderDetailLayout, handleCustomStepperClick, isSubmission,
  } = useMaintenanceProyek();

  return (
    <MaintenanceProyekProvider>
      <BreadCrumb />
      <BaseContainer sx={{ gap: 2 }}>
        {
          (!renderDetailLayout ? <CustomNavMenu /> : null)
        }
        {children}
      </BaseContainer>
    </MaintenanceProyekProvider>
  );
};

export default MaintenanceProyekLayout;
