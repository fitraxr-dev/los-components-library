'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { BusinessActivityReportProvider } from './BusinessActivityReport.context';
import UseBusinessActivityReport from './BusinessActivityReport.hook';


const BusinessActivityReportLayout = ({ children }) => {
  const { renderDetailLayout, handleBack, renderStepperLayout } = UseBusinessActivityReport();

  return (
    <BusinessActivityReportProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderStepperLayout ?
          <StepperV2
            process={TypeProcess.BAR}
            module={TypeModule.BAR}
          /> : null}
        {children}
      </BaseContainer>
    </BusinessActivityReportProvider>
  );
};

export default BusinessActivityReportLayout;
