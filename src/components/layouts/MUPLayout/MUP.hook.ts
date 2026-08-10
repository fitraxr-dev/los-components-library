import { useParams, usePathname } from 'next/navigation';

import { mup } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useMUP = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId } = useIdentity();
  const params = useParams();
  const id = Number(params.id);
  const { redirectToFromPage } = useNavigationFromPage();
  const ignoreStepperPath = [
    mup.LIST_PAGE,
    replacePath(mup.LEGAL_AND_COMPLIANCE_ISSUE_EDIT_PAGE, { id, processId }),
    replacePath(mup.FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE, { id, processId }),
    replacePath(mup.FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE, { id, processId }),
    replacePath(mup.RATING_AND_RISK_PROFILE_EDIT_PAGE, { id, processId }),
    replacePath(mup.SHARIA_COMPLIANCE_ASPECT_EDIT_INTERNAL_PAGE, { id, processId }),
    replacePath(mup.SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE, { id, processId }),
    replacePath(mup.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE, { id, processId }),
    replacePath(mup.EXECUTIVE_OVERVIEW_ADD_FULLFILLMENT_PAGE, { id, processId }),
    replacePath(mup.EXECUTIVE_OVERVIEW_EDIT_FULLFILLMENT_PAGE, { id, processId }),
    replacePath(mup.MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE, { id, processId }),
    replacePath(mup.MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE, { id, processId }),
    replacePath(mup.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_REPORT_RUTIN_EDIT_PAGE, { id, processId }),
  ];

  const ignoreBackButtonPath = [
    mup.LIST_PAGE
  ];

  const isDetailPage = !ignoreStepperPath.includes(path);
  const renderDetailLayout = isDetailPage;
  const renderBackButton = !ignoreBackButtonPath.includes(path);

  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.back();
  };

  return {
    handleBack,
    renderBackButton,
    renderDetailLayout,
    router,
  };
};

export default useMUP;
