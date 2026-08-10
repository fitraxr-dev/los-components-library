'use client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { eligibilityReview, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import {
  SelectedDocumentsProvider,
} from '@/components/pages/Review/EligibilityReview/RatingPage/context/SelectedDocumentsContext';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';


import { EligibilityReviewProvider } from './EligibilityReview.context';
import useEligibilityReview from './EligibilityReview.hook';


const EligibilityReviewLayout = ({ children }) => {
  const router = useCustomRouter();
  const { renderDetailLayout, renderBackBtn } = useEligibilityReview();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { processId } = useParams();
  const { redirectToFromPage } = useNavigationFromPage();

  const handleBack = () => {
    const pathModule = path?.split('/')[4];
    const isRatingHistory = path?.split('/')[6];
    // const fromMaintenance = searchParams.get('fromMaintenance');

    const fromPage = searchParams.get('fromPage');
    if (redirectToFromPage()) return;
    if (!!fromPage) {
      router.replace(decodeURIComponent(fromPage));
    } else {
      if (isRatingHistory.includes('history')) {
        router.replace(replacePath(eligibilityReview.RATING,
          {
            module: pathModule,
            processId: processId,
          }));
      } else {
        router.replace(replacePath(eligibilityReview.BASE_PATH, {
          module: pathModule,
        }));
      }
    }
  };

  return (
    <EligibilityReviewProvider>
      <SelectedDocumentsProvider>
        {renderBackBtn ? <BackButton handleClick={handleBack} /> : null}
        <BaseContainer>
          {
            renderDetailLayout ? (
              <>
                <StepperV2 module={TypeModule.MIP_REVIEW} process={TypeProcess.REVIEWER_DEPI} />
              </>
            ) : null
          }
          {children}
        </BaseContainer>
      </SelectedDocumentsProvider>
    </EligibilityReviewProvider>
  );
};

export default EligibilityReviewLayout;
