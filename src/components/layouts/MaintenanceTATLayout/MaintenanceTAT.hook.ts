import { useParams, usePathname } from 'next/navigation';

import { maintenanceTAT } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  maintenanceTAT.MAINTENANCE_TAT_LIST,
];

const useMaintenanceTAT = () => {
  const router = useCustomRouter();
  const params = useParams();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();
  function handleBack() {
    if (redirectToFromPage()) return;
    router.back();
  };

  function handleChangeStep(path: string) {
    const newPath = replacePath(path, { processId: params?.processId });
    router.push(newPath);
  };

  const renderDetailLayout = !ignorePath.includes(path);

  return {
    handleBack,
    handleChangeStep,
    renderDetailLayout,
  };
};

export default useMaintenanceTAT;
