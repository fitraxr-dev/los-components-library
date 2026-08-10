import { usePathname } from 'next/navigation';

import { eligibilityReview } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


interface ModulePagePath {
  modulePagePath: 'bucket-list' | 'assignment' | 'monitoring';
}

const ignorePath = [
  eligibilityReview.LIST_PAGE,
  eligibilityReview.MONITORING_LIST_PAGE,
  eligibilityReview.ASSIGNMENT_PAGE,
  eligibilityReview.HISTORY_PROCESS_PAGE,
];

const useEligibilityReview = () => {
  const [dispatch] = useApp();
  const { processId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const router = useCustomRouter();
  const path = usePathname();

  /*** Start storing path value */
  const pathArray = path.split('/');
  const modulePagePath = pathArray[4];
  const processIdPath = pathArray[5];
  const idPath = pathArray[7];

  const detailIgnorePath = [
    ...ignorePath,
    eligibilityReview.RISK_PROFILE_PAGE_ADD
      .replace('[module]', modulePagePath)
      .replace('[processId]', processIdPath),
    eligibilityReview.RISK_PROFILE_PAGE_EDIT
      .replace('[module]', modulePagePath)
      .replace('[processId]', processIdPath)
      .replace('[id]', idPath),
    eligibilityReview.RATING_HISTORY
      .replace('[module]', modulePagePath)
      .replace('[processId]', processIdPath)
  ];
  const additionalBackBtnPath = [
    ...ignorePath
  ];


  const isDetailPage = !detailIgnorePath.includes(path);
  const isShowBackBtn = !additionalBackBtnPath.includes(path);

  const renderDetailLayout = isDetailPage;

  const renderBackBtn = isShowBackBtn;
  return {
    dispatch,
    path,
    processId,
    renderBackBtn,
    renderDetailLayout,
    router,
    setViewOnly,
  };
};

export default useEligibilityReview;
