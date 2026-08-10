import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { spfp } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [spfp.LIST_PAGE, spfp.MONITORING_PAGE, spfp.ASSIGNMENT_PAGE];

const useSpfp = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];

  const { processId, noDraft, complianceNumber } = useParams();
  const { redirectToFromPage } = useNavigationFromPage();
  const additionalIgnorePath = [
    replacePath(spfp.DETAIL_DRAFT_OL_PAGE, {
      module: moduleIndex || '',
      noDraft,
      processId,
    }),
    replacePath(spfp.NOTE_COMPLIANCE_CHECK_RESPONSE_PAGE, {
      complianceNumber,
      module: moduleIndex || '',
      processId,
    }),
    replacePath(spfp.NOTE_COMPLIANCE_CHECK_PAGE, {
      complianceNumber,
      module: moduleIndex || '',
      processId,
    }),
  ];
  const renderDetailLayout = !ignorePath.includes(path);
  const isDetailPath = additionalIgnorePath.includes(path);

  const moduleBack = () => {
    switch (moduleIndex) {
      case 'bucket':
        router.push(spfp.LIST_PAGE);
        break;
      case 'monitoring':
        router.push(spfp.MONITORING_PAGE);
        break;
      case 'assignment':
        router.push(spfp.ASSIGNMENT_PAGE);
        break;
      default:
        router.push(spfp.LIST_PAGE);
        break;
    }
  };

  function handleBack() {
    if (redirectToFromPage()) return;

    // Support dynamic return path (e.g. from Log SPFP)
    const fromPageUrl = searchParams.get('fromPageUrl');
    if (fromPageUrl) {
      router.push(fromPageUrl);
      return;
    }

    isDetailPath ? router.back() : moduleBack();
  };

  return {
    handleBack,
    isDetailPath,
    renderDetailLayout,
  };
};

export default useSpfp;
