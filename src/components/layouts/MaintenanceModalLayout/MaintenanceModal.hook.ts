import { usePathname } from 'next/navigation';

import { maintenanceModal } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


const useMaintenanceModal = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId } = useIdentity();

  const ignoreStepperPath = [
    replacePath(maintenanceModal.MAINTENANCE_MODAL_PAGE, { processId }),
    replacePath(maintenanceModal.VALIDATION_PAGE, { processId }),
  ];

  const isDetailPage = !ignoreStepperPath.includes(path);
  const renderDetailLayout = isDetailPage;


  return {
    isDetailPage,
    renderDetailLayout,
    router,
  };
};

export default useMaintenanceModal;
