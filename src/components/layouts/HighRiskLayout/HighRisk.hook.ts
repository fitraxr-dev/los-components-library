import { useParams, usePathname } from 'next/navigation';

import { highRisk, mup } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useHighRisk = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId, debtorId } = useIdentity();
  const params = useParams();
  const id = Number(params.id);
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];
  const { redirectToFromPage } = useNavigationFromPage();
  const ignoreBackButtonPath = [
    highRisk.ASSIGNMENT_LIST_PAGE,
    highRisk.BUCKET_LIST_PAGE,
    highRisk.MONITORING_LIST_PAGE
  ];

  const ignoreStepperPath = [
    ...ignoreBackButtonPath,
    replacePath(highRisk.ASSIGNMENT_CONCLUSION_EDIT_VERIFICATION_PAGE, { id, processId }),
    replacePath(highRisk.BUCKET_CONCLUSION_EDIT_VERIFICATION_PAGE, { id, processId }),
    replacePath(highRisk.MONITORING_CONCLUSION_EDIT_VERIFICATION_PAGE, { id, processId }),
  ];

  const isDetailPage = !ignoreStepperPath.includes(path);
  const renderDetailLayout = isDetailPage;
  const renderBackButton = !ignoreBackButtonPath.includes(path);
  const nestedPath = ['/detail', '/edit'];

  const handleBack = () => {
    if (redirectToFromPage()) return;
    const isNestedPath = nestedPath.some((p) => path.includes(p));
    if (isNestedPath) return router.back();
    router.replace(replacePath(highRisk.BASE_PATH, { module: moduleIndex }));
  };

  return {
    debtorId,
    handleBack,
    renderBackButton,
    renderDetailLayout,
  };
};

export default useHighRisk;
