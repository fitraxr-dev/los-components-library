import { useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { mip, analyst } from '@/configs/constants/pathname';
import { ROUTE_KAJIAN } from '@/configs/constants/riviewKajian';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import { reducer } from '../AppLayout/App.constants';


const MipPrefix = {
  'MIP': { module: TypeModule.MIP, process: TypeProcess.MIP },
  'MIPA': { module: TypeModule.MIP, process: TypeProcess.MIP_ANALYST },
  'MIPR': { module: TypeModule.MIP_REVIEW, process: TypeProcess.MIP_REVIEW },
  'MREV': { module: TypeModule.MIP_REVIEW, process: TypeProcess.MIP_REVIEW_REVISION },
};

const AnalystPath = ['debtor-information', 'financial-analysis', 'peer-comparison', 'financial-projection', 'view-all-document', 'validation'];

const useMIP = () => {
  const { processId } = useIdentity();
  const params = useParams();
  const id = Number(params.id);
  const [state, dispatch] = useApp();
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];

  const ignorePath = [
    mip.LIST_PAGE,
    analyst.LIST_PAGE,
    replacePath(mip.SHARIA_COMPLIANCE_ASPECT_EDIT_INTERNAL_PAGE, { id, processId }),
    replacePath(mip.SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE, { id, processId }),
    replacePath(mip.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE, { id, processId }),
    replacePath(mip.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_REPORT_RUTIN_EDIT_PAGE, { id, processId }),
    replacePath(mip.RATING_HISTORY, { processId }),
  ];

  const ignoreBackButtonPath = [
    mip.LIST_PAGE,
    analyst.LIST_PAGE,
  ];

  const renderBackButton = !ignoreBackButtonPath.includes(path);

  const renderDetailLayout = !ignorePath.includes(path);

  useMemo(() => {
    if (path.split('/').length > 5 && !!processId) {
      const bucketPrefix = processId.split('-')[0];
      const currentPath = path.split('/')[3];
      const mipPath = currentPath === 'mip';
      const analystPath = currentPath === 'analyst';

      if (mipPath || analystPath) {
        dispatch({
          data: {
            ...state.pages,
            mipModule: MipPrefix[bucketPrefix]?.module,
            mipProcess: MipPrefix[bucketPrefix]?.process,
          },
          type: reducer.SET_PAGES,
        });
      }
    }
  }, [processId]);

  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    if (redirectToFromPage()) return;
    const { pages } = state;
    const lastPathArray = pages.lastPath?.split('/');
    const isGoToMip = lastPathArray?.[4]?.split('-')[0] !== 'MIP';

    if (path.includes('rating-history')) {
      const targetPath = replacePath(mip.RATING_AND_RISK_PROFILE_PAGE, { processId });
      router.push(`${targetPath}?tab=risk-profile`);
      return;
    }

    if (path.includes('edit-internal-concern') || path.includes('edit-external-concern')) {
      router.push(replacePath(mip.SHARIA_COMPLIANCE_ASPECT_PAGE, { processId }));
      return;
    }

    if (path.includes('environmental-and-social-safeguard-issue/edit')) {
      const targetPath = replacePath(mip.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_PAGE, { processId });
      router.push(`${targetPath}?tab=corrective-action-plan`);
      return;
    }

    if (
      pages.returnContext?.fromPage === ROUTE_KAJIAN.ASPECT_LEGAL_RIVIEW ||
      pages.returnContext?.fromPage === ROUTE_KAJIAN.KEPATUHAN_SYARIAH ||
      isGoToMip
    ) {
      if (pages.lastPath) {
        router.push(pages.lastPath);
        dispatch({
          data: {
            ...state.pages,
            lastPath: null,
            returnContext: null,
          },
          type: reducer.SET_PAGES,
        });
        return;
      }
    }

    switch (moduleIndex) {
      case 'mip':
        router.push(mip.LIST_PAGE);
        break;
      case 'analyst':
        router.push(analyst.LIST_PAGE);
        break;
      default:
        if (pages.lastPath && (!pages.lastPath.includes('/mip/') || isGoToMip) && !pages.lastPath.includes('/analyst/')) {
          router.push(pages.lastPath);
        } else {
          router.push(mip.LIST_PAGE);
        }
        break;
    }
  };

  return {
    handleBack,
    renderBackButton,
    renderDetailLayout,
  };
};

export default useMIP;
