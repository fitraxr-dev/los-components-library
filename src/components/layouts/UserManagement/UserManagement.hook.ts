import { usePathname, useRouter } from 'next/navigation';

import { userManagement } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  userManagement.USER_LIST.BUCKET_LIST,
  userManagement.ACCESS_MENU.BUCKET_LIST
];

const creationLastPath = ['add', 'edit'];

const useUserManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentModule = pathname.split('/')[2];

  const isAccessMenu = pathname.includes('access-menu');
  const isUserList = pathname.includes('user-list');

  const renderDetailLayout = !ignorePath.includes(pathname);
  const isCreationPage = creationLastPath.includes(getLastPath(pathname));
  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    if (redirectToFromPage()) return;
    router.push(replacePath(userManagement.BASE_PATH, { module: currentModule }));
  };

  const _module =
    isUserList
      ? TypeModule.USER_MANAGEMENT
      : isAccessMenu && TypeModule.ACCESS_MENU;

  const _process =
    isUserList
      ? TypeProcess.USER_MANAGEMENT
      : isAccessMenu && TypeProcess.ACCESS_MENU;

  return {
    _module,
    _process,
    handleBack,
    isCreationPage,
    renderDetailLayout,
  };
};

export default useUserManagement;
