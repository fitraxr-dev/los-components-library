'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import BreadCrumb from './components/BreadCrumb/BreadCrumb';
import CustomNavMenu from './components/CustomNavMenu';
import { MaintenanceDataProvider } from './MaintenanceData.context';
import useMaintenanceData from './MaintenanceData.hook';


const MaintenanceDataLayout = ({ children }) => {
  const {
    renderDetailLayout,
    isDetailPage,
    handleBack,
    isMaintenanceDebtor,
    pathUseBackButton,
    path,
  } = useMaintenanceData();
  return (
    <MaintenanceDataProvider>
      {
        !isMaintenanceDebtor ?
          (!isDetailPage ? <BackButton handleClick={handleBack} /> : null) :
          pathUseBackButton.includes(path) ? <BackButton handleClick={() => handleBack(true)} />
            : <BreadCrumb />
      }
      <BaseContainer>
        {!renderDetailLayout ?
          <CustomNavMenu /> : null
        }
        {children}
      </BaseContainer>
    </MaintenanceDataProvider>
  );
};

export default MaintenanceDataLayout;
