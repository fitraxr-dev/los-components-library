'use client';
import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ModalPortal from '@/components/layouts/MUILayout/components/ModalPortal';
import BaseContainer from '@/components/shared/BaseContainer';
import Progress from '@/components/shared/Progress';//
import Stepper from '@/components/shared/Stepper';//
import StepperV2 from '@/components/shared/StepperV2';

import BreadCrumb from './components/BreadCrumb';
import CustomStepper from './components/CustomStepper';//
import { MaintenanceGroupProvider, useMaintenanceGroupContext } from './MaintenanceGroup.context';
import useMaintenanceGroup from './MaintenanceGroup.hook';


const MaintenanceGroupLayout = ({ children }) => {
  return (
    <MaintenanceGroupProvider>
      <MaintenanceGroupContent>{children}</MaintenanceGroupContent>
    </MaintenanceGroupProvider>
  );
};

const MaintenanceGroupContent = ({ children }) => {
  const { stepperStepsWithChanges, hasUnsavedChanges } = useMaintenanceGroupContext();

  const {
    renderDetailLayout, handleCustomStepperClick, isSubmission, isEdit,
  } = useMaintenanceGroup(undefined, hasUnsavedChanges);

  // Custom stepper click handler for Create page
  const handleCustomStepperClickWithConfirmation = (url: string) => {
    // For now, just use the default navigation
    // The Create page will handle its own navigation with confirmation
    handleCustomStepperClick(url);
  };

  const path = usePathname();
  const pathArray = path.split('/');
  const groupId = pathArray[3];

  return (
    <>
      <BreadCrumb />
      <BaseContainer sx={{ gap: 2 }}>
        {
          ((!renderDetailLayout && (isSubmission || isEdit)) ? (
            <CustomStepper
              menuList={[
                {
                  key: 'group',
                  label: 'Group Information',
                  url: 'maintenance-group',
                },
                {
                  key: 'validation',
                  label: 'Validation',
                  url: 'validation',
                },
              ]}
              onClick={handleCustomStepperClickWithConfirmation}
              stepperStepsWithChanges={stepperStepsWithChanges}
            />
          ) :
            (!renderDetailLayout ? (
              <StepperV2
                process={TypeProcess.MAINTENANCE_GROUP}
                module={TypeModule.MAINTENANCE_DATA}
                id={groupId}
              />
            ) : null)
          )}
        {children}
      </BaseContainer>
      <ModalPortal />
    </>
  );
};

export default MaintenanceGroupLayout;
