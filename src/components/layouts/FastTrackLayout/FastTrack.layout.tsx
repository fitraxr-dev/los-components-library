'use client';
import { TypeModule } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { FastTrackProvider } from './FastTrack.context';
import useFastTrack from './FastTrack.hook';


const FastTrackLayout = ({ children }) => {
  const {
    renderDetailLayout,
    hideStepper,
    handleBack,
    process,
  } = useFastTrack();

  return (
    <FastTrackProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderDetailLayout && !hideStepper ? (
          <StepperV2
            process={process}
            module={TypeModule.FAST_TRACK}
          />
        ) : null}
        {children}
      </BaseContainer>
    </FastTrackProvider>
  );
};

export default FastTrackLayout;
