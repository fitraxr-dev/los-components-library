import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { technicalStudyReview } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import { reducer } from '../AppLayout/App.constants';


const ignorePath = [
  technicalStudyReview.ASSIGNMENT_PAGE,
  technicalStudyReview.MONITORING_PAGE,
  technicalStudyReview.REQUEST_PAGE,
  technicalStudyReview.REVIEW_PAGE,
];
const technicalStudyReviewPrefix = {
  'PIPE': { module: TypeModule.TECHNICAL_REVIEW, process: TypeProcess.TECHNICAL_REVIEW },
  'TR': { module: TypeModule.TECHNICAL_REVIEW, process: TypeProcess.TECHNICAL_REVIEW },
  'TRD': { module: TypeModule.TECHNICAL_REVIEW, process: TypeProcess.TECHNICAL_REVIEW_DELST },
};


const useTechnicalStudyReview = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const isDetailPage = !ignorePath.includes(path);
  const [state, dispatch] = useApp();
  const { processId, setProcessId } = useIdentity();
  const { redirectToFromPage } = useNavigationFromPage();

  useMemo(() => {
    if (path.split('/').length > 5 && !!processId) {
      const bucketPrefix = processId.split('-')[0];
      const currentPath = path.split('/')[3];
      const trPath = currentPath === 'technical-study-review';

      if (trPath) {
        dispatch({
          data: {
            ...state.pages,
            module: technicalStudyReviewPrefix[bucketPrefix]?.module,
            process: technicalStudyReviewPrefix[bucketPrefix]?.process,
          },
          type: reducer.SET_PAGES,
        });
      }
    }
  }, [processId]);

  function handleBack() {
    if (redirectToFromPage()) return;
    try {
      const url = new URL(window.location.href);
      const returnParam = url.searchParams.get('return');
      if (returnParam) {
        const decoded = decodeURIComponent(returnParam);
        if (decoded && decoded !== path) {
          router.push(decoded);
          return;
        }
      }
    } catch (_e) {
    }

    switch (moduleIndex) {
      case 'request':
        router.push(technicalStudyReview.REQUEST_PAGE);
        break;
      case 'review':
        router.push(technicalStudyReview.REVIEW_PAGE);
        break;
      case 'monitoring':
        router.push(technicalStudyReview.MONITORING_PAGE);
        break;
      case 'assignment':
        router.push(technicalStudyReview.ASSIGNMENT_PAGE);
        break;
      default:
        router.push(technicalStudyReview.REQUEST_PAGE);
        break;
    }
  };

  const renderDetailLayout = isDetailPage;

  return {
    handleBack,
    renderDetailLayout,
  };
};

export default useTechnicalStudyReview;
