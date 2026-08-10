import { useParams, usePathname } from 'next/navigation';

import { businessActivityReport } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const UseBusinessActivityReport = () => {
  const router = useCustomRouter();
  const params = useParams();
  const path = usePathname();
  const { processId, debtorId } = params;
  const groupId = getLastPath(path);

  const groupPath = replacePath(businessActivityReport.GROUP_PAGE, { debtorId, processId });
  const groupDetailPath = replacePath(businessActivityReport.GROUP_DETAIL_PAGE, { debtorId, groupId, processId });
  const groupNewPath = replacePath(businessActivityReport.NEW_GROUP_PAGE, { debtorId, processId });
  const { redirectToFromPage } = useNavigationFromPage();
  const ignorePath = [
    businessActivityReport.LIST,
  ];

  const ignoreStepperPath = [
    ...ignorePath,
    groupPath,
    groupDetailPath,
    groupNewPath,
  ];

  const handleBack = () => {
    if (redirectToFromPage()) return;
    const isPathGroup = businessActivityReport.GROUP_PAGE.split('/')[3];
    if (path?.includes(isPathGroup)) return router.back();
    router.replace(businessActivityReport.LIST);
  };

  function handleChangeStep(path: string) {
    const newPath = replacePath(path, { processId: params?.processId });
    router.push(newPath);
  };

  const renderDetailLayout = !ignorePath.includes(path);
  const renderStepperLayout = !ignoreStepperPath.includes(path);
  return {
    handleBack,
    handleChangeStep,
    renderDetailLayout,
    renderStepperLayout,
  };
};

export default UseBusinessActivityReport;
