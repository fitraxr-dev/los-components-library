'use client';

import { usePathname } from 'next/navigation';

import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import StepperV2 from '@/components/shared/StepperV2';

import BackButton from '../../shared/BackButton';
import BaseContainer from '../../shared/BaseContainer';

import { AspectLegalReviewcProvider } from './AspectLegalReview.context';
import useAspectLegalReview from './AspectLegalReview.hooks';


const AspectLegalReviewLayout = ({ children }) => {
  const router = useCustomRouter();
  const { renderDetailLayout, renderBackBtn } = useAspectLegalReview();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();

  const handleBack = () => {
    const pathModule = path?.split('/')[4];
    const identifyLegalRisk = 'identify-legal-risks';

    const identifyCreatePath = getLastPath(ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_CREATE_PAGE);
    const identifyEditPath = getLastPath(ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_EDIT_PAGE);

    if (redirectToFromPage()) return;

    if (path?.includes(identifyLegalRisk)
      && (path?.includes(identifyCreatePath)
        || path?.includes(identifyEditPath))) return router.back();

    router.replace(replacePath(ASPECT_LEGAL_REVIEW.BASE_PATH,
      {
        module: pathModule,
      }
    ));

  };
  return (
    <AspectLegalReviewcProvider>
      {
        renderBackBtn && <BackButton handleClick={handleBack} />
      }
      <BaseContainer>
        {
          renderDetailLayout ?
            <>
              <StepperV2 module={TypeModule.MIP_REVIEW} process={TypeProcess.REVIEWER_DH} />
            </> : null
        }
        {children}
      </BaseContainer>
    </AspectLegalReviewcProvider>
  );
};

export default AspectLegalReviewLayout;
