import { usePathname } from 'next/navigation';

import { virtualAccount } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  virtualAccount.VA_LIST,
  virtualAccount.VA_ACTIVATIN_LIST,
];

const UseVirtualAccount = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId } = useIdentity();
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];
  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    if (redirectToFromPage()) return;
    router.back();
  };

  const renderDetailLayout = !ignorePath.includes(path);

  return {
    bucketProcessId,
    debtorIdFromProcess,
    handleBack,
    renderDetailLayout,
  };
};

export default UseVirtualAccount;
