import { useParams, usePathname } from 'next/navigation';

import { ONE_MINUTE } from '@/configs/constants';
import { mupAnalyst } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useMUPAnalyst = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId } = useIdentity();
  const params = useParams();
  const id = Number(params.id);

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  }, { staleTime: ONE_MINUTE });

  const bucketParentId = bucketDetail?.bucketParentId;
  const { redirectToFromPage } = useNavigationFromPage();
  const ignoreStepperPath = [
    mupAnalyst.LIST_PAGE,
    replacePath(mupAnalyst.LEGAL_AND_COMPLIANCE_ISSUE_EDIT_PAGE, { id, processId }),
    replacePath(mupAnalyst.FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE, { id, processId }),
    replacePath(mupAnalyst.FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE, { id, processId }),
    replacePath(mupAnalyst.RATING_AND_RISK_PROFILE_EDIT_PAGE, { id, processId }),
    replacePath(mupAnalyst.SHARIA_COMPLIANCE_ASPECT_EDIT_PAGE, { id, processId }),
    replacePath(mupAnalyst.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE, { id, processId })
  ];

  const ignoreBackButtonPath = [
    mupAnalyst.LIST_PAGE
  ];

  const isDetailPage = !ignoreStepperPath.includes(path);
  const renderDetailLayout = isDetailPage;
  const renderBackButton = !ignoreBackButtonPath.includes(path);

  const handleBack = () => {
    if (redirectToFromPage()) return;
    router.push(mupAnalyst.LIST_PAGE);
  };

  return {
    bucketParentId,
    handleBack,
    renderBackButton,
    renderDetailLayout,
    router,
  };
};

export default useMUPAnalyst;
