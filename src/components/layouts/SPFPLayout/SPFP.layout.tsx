'use client';

import { memo } from 'react';

import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { SpfpProvider } from './SPFP.context';
import useSpfp from './SPFP.hook';


export const Stepper = memo(function Stepper({ processId }: { processId: string }) {
  const bucketPrefix = processId.split('-')[0];
  switch (bucketPrefix) {
    case 'SPFP':
      return (
        <StepperV2 module={TypeModule.SPFP} process={TypeProcess.SPFP} />
      );
    case 'SPF':
      return (
        <StepperV2 module={TypeModule.SPFP} process={TypeProcess.SPFP_FINAL} />
      );
    case 'SPDP':
      return (
        <StepperV2 module={TypeModule.SPFP} process={TypeProcess.SPDP} />
      );
    default:
      return (
        <StepperV2 module={TypeModule.SPFP} process={TypeProcess.SPFP} />
      );
  }
});

const SpfpLayout = ({ children }) => {
  const params = useParams<{ processId: string }>();

  const {
    handleBack,
    renderDetailLayout,
    isDetailPath,
  } = useSpfp();

  return (
    <SpfpProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout && !isDetailPath ? (
            <Stepper processId={params.processId} />
          ) : null
        }
        {children}
      </BaseContainer>
    </SpfpProvider>
  );
};

export default SpfpLayout;
