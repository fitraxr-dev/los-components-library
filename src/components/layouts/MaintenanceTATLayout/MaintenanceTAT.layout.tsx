'use client';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Progress from '@/components/shared/Progress';
import Stepper from '@/components/shared/Stepper';

import { DEFAULT_STEPS_BAR } from './MaintenanceTAT.constant';
import { MaintenanceTATProvider } from './MaintenanceTAT.context';
import useMaintenanceTAT from './MaintenanceTAT.hook';


const MaintenanceTATLayout = ({ children }) => {
  const { renderDetailLayout, handleChangeStep, handleBack } = useMaintenanceTAT();

  return (
    <MaintenanceTATProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderDetailLayout ? (
          <>
            <Stepper
              steps={DEFAULT_STEPS_BAR}
              onClick={(path) => handleChangeStep(path)}
            />
            <Progress percentage={75} />
          </>
        ) : null}
        {children}
      </BaseContainer>
    </MaintenanceTATProvider>
  );
};

export default MaintenanceTATLayout;
