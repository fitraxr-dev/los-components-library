import { usePathname } from 'next/navigation';

import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


const ignorePathAspectReview = [
  ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_CREATE_PAGE,
  ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_EDIT_PAGE,
  ASPECT_LEGAL_REVIEW.LIST_PAGE,
  ASPECT_LEGAL_REVIEW.MONITORING_LIST_PAGE,
  ASPECT_LEGAL_REVIEW.ASSIGNMENT_PAGE,
  ASPECT_LEGAL_REVIEW.HISTORY_PROCESS_PAGE,
  ASPECT_LEGAL_REVIEW.ASSIGNMENT_PAGE,

];


const useAspectLegalReview = () => {
  const [dispatch] = useApp();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const path = usePathname();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const processIdIndex = pathArray[5];
  const idIndex = pathArray[7];
  const additionalIgnorePath = [
    ...ignorePathAspectReview,
    ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_CREATE_PAGE.replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex),
    ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_EDIT_PAGE.replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex).replace('[id]', idIndex),
  ];

  const additionalBackBtnPath = [
    ...ignorePathAspectReview
  ];

  const isDetailPage = !additionalIgnorePath.includes(path);
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
  };
};

export default useAspectLegalReview;
