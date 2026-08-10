import { usePathname } from 'next/navigation';

import { bmppMonitoring } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';


const useBmppMonitoringLayout = () => {
  const pathname = usePathname();
  const router = useCustomRouter();

  const handleBack = () => {
    router.replace(bmppMonitoring.MAIN_PAGE);
  };

  return {
    handleBack,
  };
};

export default useBmppMonitoringLayout;
