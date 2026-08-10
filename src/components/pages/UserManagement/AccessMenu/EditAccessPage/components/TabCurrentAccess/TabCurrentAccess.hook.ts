import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import useGetAccessMenuDetail from '@/components/pages/UserManagement/hooks/useGetAccessMenuDetail';

import useGetApprovalDetail from '../../../hooks/useGetApprovalDetail';

import type { AccessMenu } from '@/components/pages/UserManagement/components/TableAccessMenu/TableAccessMenu.types';


interface AccessMenuItems extends AccessMenu {
  subMenu: AccessMenuItems[];
}

const useTabCurrentAccess = () => {
  const { idParams, isApproval } = useUserManagementContext();

  const {
    data: accesMenuDetailData,
    isSuccess: isAccessMenuDetailSuccess,
  } = useGetAccessMenuDetail({ id: idParams }, {
    enabled: !isApproval,
  });
  const {
    data: accessMenuApprovalDetailData,
    isSuccess: isAccessMenuApprovalDetailSuccess,
  } = useGetApprovalDetail({ id: idParams }, {
    enabled: isApproval,
  });

  const accessMenuDetail = isApproval ? accessMenuApprovalDetailData : accesMenuDetailData;
  const isDetailSuccess = isApproval ? isAccessMenuApprovalDetailSuccess : isAccessMenuDetailSuccess;
  const accessName = accessMenuDetail?.name || 'Access Menu';
  const accessMenuItems = accessMenuDetail?.menuItems as AccessMenuItems[] || [];

  return {
    accessMenuItems,
    accessName,
  };
};

export default useTabCurrentAccess;
