import { usePathname } from 'next/navigation';


import UserManagementCreation from '../../../DetailPage/Components/UserManagementCreation';
import UserManagementViewOnly from '../../../DetailPage/Components/UserManagementViewOnly';


const useUserForm = () => {
  const pathname = usePathname();

  const renderViewOnlyMode = () => (
    <UserManagementViewOnly />
  );
  const renderEditMode = () => (
    <UserManagementCreation />
  );

  const renderPageByPath = () => {

    if (pathname.includes('/edit')) {
      return renderEditMode();
    }

    return renderViewOnlyMode();
  };

  const renderPage = renderPageByPath();

  return {
    renderPage,
  };
};

export default useUserForm;
