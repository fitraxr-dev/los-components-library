import { usePathname } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { creditChecking } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const IGNORE_PATH = [
  creditChecking.ASSIGNMENT_PAGE,
  creditChecking.BUCKET_LIST_PAGE,
  creditChecking.HISTORY_PROCESS_PAGE,
  creditChecking.MONITORING_PAGE,
  creditChecking.REQUEST_PAGE,
];

const HIDE_STEPPER = [
  '/edit/debtor',
  '/add/debtor',
  '/add/shareholder',
  '/edit/shareholder',
  '/add/management',
  '/edit/management',
  '/add/other-related',
  '/edit/other-related',
];

const useCreditChecking = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const isDetailPage = !IGNORE_PATH.includes(path);
  const hideStepper = HIDE_STEPPER.some((value) => path.includes(value));
  const processUrl = path.split('/')[3];
  const { divisionCode } = useDivision();
  const pathSegments = path.split('/');
  const isAddPage = pathSegments.includes('add');
  const isEditPage = pathSegments.includes('edit');
  const isAddOrEditPage = isAddPage || isEditPage;
  const { redirectToFromPage } = useNavigationFromPage();
  const isDpop = divisionCode.includes(DPOP_DIVISION);


  function handleBack() {
    if (redirectToFromPage()) return;
    if (isAddOrEditPage) {
      return router.back();
    }

    switch (processUrl) {
      case 'request':
        if (isDpop) {
          return router.push(creditChecking.BUCKET_LIST_PAGE);
        } else {
          return router.push(creditChecking.REQUEST_PAGE);
        }
      case 'assignment':
        return router.push(creditChecking.ASSIGNMENT_PAGE);
      case 'bucket-credit-checking':
        return router.push(creditChecking.BUCKET_LIST_PAGE);
      case 'monitoring':
        return router.push(creditChecking.MONITORING_PAGE);
      default:
        return router.push(creditChecking.REQUEST_PAGE);
    }
  }

  const renderDetailLayout = isDetailPage;
  let process;
  switch (processUrl) {
    case 'request':
      process = TypeProcess.CREDIT_CHECKING;
      break;
    case 'assignment':
      process = TypeProcess.CREDIT_CHECKING_DPOP;
      break;
    case 'bucket-credit-checking':
      process = TypeProcess.CREDIT_CHECKING_DPOP;
      break;
    case 'monitoring':
      process = TypeProcess.CREDIT_CHECKING_DPOP;
      break;
    default:
      process = TypeProcess.CREDIT_CHECKING;
      break;
  }

  return {
    handleBack,
    hideStepper,
    process,
    renderDetailLayout,
  };
};

export default useCreditChecking;
