'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import BreadCrumb from './components/BreadCrumb';
import { MaintenanceModalProvider, useMaintenanceModalContext } from './MaintenanceModal.context';
import useMaintenanceModal from './MaintenanceModal.hook';


const MaintenanceModalContent = ({ children }) => {
  const {
    renderDetailLayout,
  } = useMaintenanceModal();

  const { formProgress } = useMaintenanceModalContext();

  return (
    <>
      <BreadCrumb />
      <BaseContainer sx={{ gap: 2 }}>
        {
          (!renderDetailLayout ? (
            <StepperV2
              process={TypeProcess.MAINTENANCE_CAPITAL}
              module={TypeModule.MAINTENANCE_DATA}
              customProgress={formProgress}
            />
          ) : null)
        }
        {children}
      </BaseContainer>
    </>
  );
};

const MaintenanceGroupLayout = ({ children }) => {
  return (
    <MaintenanceModalProvider>
      <MaintenanceModalContent>
        {children}
      </MaintenanceModalContent>
    </MaintenanceModalProvider>
  );
};

export default MaintenanceGroupLayout;
