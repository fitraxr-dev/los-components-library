'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { SiteVisitProvider } from './SiteVisit.context';
import useSiteVisit from './SiteVisit.hook';


const SiteVisitLayout = ({ children }) => {
  const {
    handleBack,
    shouldRenderStepper,
  } = useSiteVisit();

  return (
    <>
      {shouldRenderStepper ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {shouldRenderStepper ? (
          <>
            <StepperV2
              module={TypeModule.SITE_VISIT}
              process={TypeProcess.SITE_VISIT}
            />
          </>
        ) : null}
        {children}
      </BaseContainer>
    </>
  );
};

const SiteVisitLayoutWithProvider = ({ children }) => {
  return (
    <SiteVisitProvider>
      <SiteVisitLayout>{children}</SiteVisitLayout>
    </SiteVisitProvider>
  );
};

export default SiteVisitLayoutWithProvider;
