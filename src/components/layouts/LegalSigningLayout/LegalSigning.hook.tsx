import { usePathname } from 'next/navigation';

import { legalSigning } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


const ignorePathAspectReview = [
  legalSigning.LIST_PAGE,
  legalSigning.MONITORING_PAGE,
  legalSigning.ASSIGNMENT_PAGE,
  legalSigning.HISTORY_PROCESS_PAGE,
];


const useLegalSigning = () => {
  const [dispatch] = useApp();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const processModule = pathArray[3];
  const processIdIndex = pathArray[4];
  const idIndex = pathArray[6];

  const additionalIgnorePath = [
    ...ignorePathAspectReview,
    legalSigning.PK_PROCESSING_DETAIL_PAGE
      .replace('[module]', processModule)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
  ];
  const isDetailPage = !additionalIgnorePath.includes(path);

  const additionalBackBtnPath = [
    ...ignorePathAspectReview
  ];
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

export default useLegalSigning;
