'use client';

import { type ReactNode } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { SelectedDocumentsProvider } from '@/components/pages/AnnualReview/RatingPage/context/SelectedDocumentsContext';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { AnnualReviewProvider } from './AnnualReview.context';
import useAnnualReview from './AnnualReview.hooks';


const AnnualReviewLayout = ({ children }: { children: ReactNode }) => {
  const {
    handleBack,
    renderBackButton,
    renderDetailLayout,
    typeProcess,
    isPreview,
  } = useAnnualReview();

  return (
    <AnnualReviewProvider>
      <SelectedDocumentsProvider>
        {renderBackButton && <BackButton handleClick={handleBack} />}
        <BaseContainer>
          {renderDetailLayout && <StepperV2
            module={TypeModule.ANNUAL_REVIEW}
            process={typeProcess}
          />}
          {children}
        </BaseContainer>
      </SelectedDocumentsProvider>
    </AnnualReviewProvider>
  );
};
export default AnnualReviewLayout;
