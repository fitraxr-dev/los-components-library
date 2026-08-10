'use client';
import { useParams, usePathname } from 'next/navigation';

import { engagementSubmission } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import {
  EngagementSubmissionProvider,
} from '@/components/layouts/EngagementSubmissionLayout/EngagementSubmission.context';
import StepperV2 from '@/components/shared/StepperV2';

import BackButton from '../../shared/BackButton';
import BaseContainer from '../../shared/BaseContainer';

import useEngagementSubmission from './EngagementSubmission.hook';


const EngagementSubmissionLayout = ({ children }) => {
  const router = useCustomRouter();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();
  const {
    renderDetailLayout,
    isEdit,
    isParentChildPage,
  } = useEngagementSubmission();


  const handleBack = () => {
    if (redirectToFromPage()) return;
    const pathDetail = getLastPath(engagementSubmission.PK_PROCESSING_DETIAL_PAGE);
    const pathParentChildLimit = getLastPath(engagementSubmission.FACILITY_PARENT_CHILD_LIMIT);
    if (path?.includes(pathDetail)) return router.back();
    else if (path?.includes(pathParentChildLimit)) return router.back();
    router.replace(engagementSubmission.LIST_PAGE);
  };

  return (
    <EngagementSubmissionProvider>
      {renderDetailLayout || isEdit ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout && !isParentChildPage ?
            <>
              <StepperV2
                module={TypeModule.ENGAGEMENT_AGREEMENT}
                process={TypeProcess.ENGAGEMENT_AGREEMENT}
              />
            </> : null
        }
        {children}
      </BaseContainer>
    </EngagementSubmissionProvider>
  );
};

export default EngagementSubmissionLayout;
