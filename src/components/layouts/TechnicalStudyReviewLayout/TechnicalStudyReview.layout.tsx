'use client';
import { TypeModule } from '@/enums/Module';
import useApp from '@/hooks/useApp';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { TechnicalStudyReviewProvider } from './TechnicalStudyReview.context';
import useTechnicalStudyReview from './TechnicalStudyReview.hook';


const TechnicalStudyReviewLayout = ({ children }) => {
  const [state] = useApp();
  const {
    renderDetailLayout,
    handleBack,
  } = useTechnicalStudyReview();

  return (
    <TechnicalStudyReviewProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2
                process={state.pages.process}
                module={state.pages.module}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </TechnicalStudyReviewProvider>
  );
};

export default TechnicalStudyReviewLayout;
