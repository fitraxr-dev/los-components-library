import { useParams, usePathname } from 'next/navigation';

import { loanProcessingSummary } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  loanProcessingSummary.BUCKET_LPS_CORE,
];

const useLpsLayoutCore = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const params = useParams();
  const { redirectToFromPage } = useNavigationFromPage();
  const processIdIndex = String(params.processId);
  const idIndex = String(params.id);
  const [{ currentRole }] = useApp();
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isSuperAdmin = isMaker || isChecker;

  const handleBack = () => {
    if (redirectToFromPage()) return;
    const splitPath = loanProcessingSummary.ADDITIONAL_FACILITY?.split('/');
    const additonalFacility = splitPath[splitPath?.length - 2];

    const splitDetailShareholder = loanProcessingSummary.DETAIL_SHAREHOLDER?.split('/');
    const detailShareholder = splitDetailShareholder[splitDetailShareholder?.length - 2];

    const splitDetailManagement = loanProcessingSummary.DETAIL_MANAGEMENT?.split('/');
    const detailManagement = splitDetailManagement[splitDetailManagement?.length - 2];

    const splitFacilityLimit = loanProcessingSummary.FACILITY_PARENT_CHILD_LIMIT?.split('/');
    const facilityLimitSegment = splitFacilityLimit[splitFacilityLimit?.length - 1];

    if (path?.includes(additonalFacility) || path?.includes(facilityLimitSegment)) {
      return router.replace(loanProcessingSummary.FINANCING_FACILITY?.replace('[processId]', processIdIndex));
    }

    if (path?.includes(detailShareholder) || path?.includes(detailManagement)) {
      return router.replace(loanProcessingSummary.DATA_ON_CORE_REQUIREMENT?.replace('[processId]', processIdIndex));
    }

    router.replace(loanProcessingSummary.BUCKET_LPS_CORE);
  };

  const additionalBackBtn = [
    loanProcessingSummary.BUCKET_LPS_CORE,
  ];
  // Still need to be updated
  const additionalIgnorePath = [
    ...ignorePath,
    loanProcessingSummary.ADDITIONAL_FACILITY?.replace('[processId]', processIdIndex)?.replace('[id]', idIndex),
    loanProcessingSummary.DETAIL_MANAGEMENT?.replace('[processId]', processIdIndex)?.replace('[id]', idIndex),
    loanProcessingSummary.DETAIL_SHAREHOLDER?.replace('[processId]', processIdIndex)?.replace('[id]', idIndex),
    loanProcessingSummary.FACILITY_PARENT_CHILD_LIMIT?.replace('[processId]', processIdIndex)?.replace('[id]', idIndex),
  ];
  const isDetailPage = !additionalIgnorePath.includes(path);


  const isBackBtn = !additionalBackBtn.includes(path);

  const renderDetailLayout = isDetailPage;


  return {
    handleBack,
    isBackBtn,
    isSuperAdmin,
    renderDetailLayout,
  };
};

export default useLpsLayoutCore;
