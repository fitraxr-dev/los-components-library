import { useMemo } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  DEPI_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants';
import { annualReview } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useAnnualReview = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const params = useParams();
  const { divisionCode } = useDivision();
  const isPreview = Boolean(useSearchParams().get('isPreview'));
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
  ];
  const [{ currentRole, currentPosition }] = useApp();
  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);
  const isDepiDivision = divisionCode.includes(DEPI_DIVISION);
  const isKadiv = currentRole.includes('KADIV');
  const isTL = currentRole.includes('TL');
  const isRM = currentRole.includes('STAFF');
  const isAnalyst = currentPosition.some((pos) => pos.toUpperCase().includes('ANALYST'));
  const { redirectToFromPage } = useNavigationFromPage();
  const ignorePath = [
    annualReview.LIST_PAGE.replace('[pageModule]', String(params?.pageModule)),
    annualReview.RATING_HISTORY
      .replace('[pageModule]', String(params?.pageModule))
      .replace('[processId]', String(params?.processId)),
    //sisanya menyusul
  ];

  const ignoreBackButtonPath = [
    annualReview.LIST_PAGE.replace('[pageModule]', String(params?.pageModule)),
  ];

  const renderBackButton = !ignoreBackButtonPath.includes(path);

  const renderDetailLayout = !ignorePath.includes(path);


  const typeProcess = useMemo(() => {
    switch (params?.pageModule) {
      case 'assignment':
      case 'verification':
      case 'monitoring':
        return TypeProcess.ANNUAL_REVIEW_DEPI;
      case 'analyst':
        return TypeProcess.ANNUAL_REVIEW_ANALYST;
      case 'request':
      default:
        return TypeProcess.ANNUAL_REVIEW;
    }
  }, [params?.pageModule]);


  const handleBack = () => {
    if (redirectToFromPage()) return;

    const ratingHistoryPath = replacePath(annualReview.RATING_HISTORY, {
      pageModule: String(params?.pageModule),
      processId: String(params?.processId),
    });

    if (path === ratingHistoryPath) {
      router.replace(
        replacePath(annualReview.RATING, {
          pageModule: String(params?.pageModule),
          processId: String(params?.processId),
        }),
      );
      return;
    }

    router.replace(replacePath(annualReview.LIST_PAGE, { pageModule: String(params?.pageModule) }));
  };

  return {
    handleBack,
    isPreview,
    renderBackButton,
    renderDetailLayout,
    typeProcess,
  };
};
export default useAnnualReview;
