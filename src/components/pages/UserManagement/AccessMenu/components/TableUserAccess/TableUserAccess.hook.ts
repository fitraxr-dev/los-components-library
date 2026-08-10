import { useState } from 'react';

import { formatDate } from '@/helpers/date';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';

import useGetAccessMenuDetail from '../../../hooks/useGetAccessMenuDetail';
import useGetApprovalDetail from '../../hooks/useGetApprovalDetail';
import useGetUserUsageList from '../../hooks/useGetUserUsageList';


const useTableUserAccess = () => {
  const { isApproval, idParams } = useUserManagementContext();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

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

  const { data: userUsageData, isLoading: isUserUsageLoading } = useGetUserUsageList({
    filter: {
      permissionCode: accessMenuDetail?.permissionCode,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, {
    enabled: isDetailSuccess,
  });

  const tableData = userUsageData?.contents?.map((user) => ({
    ...user,
    division: user.division ?? '-',
    email: user.email ?? '-',
    mappingDate: user.mappingDate ? formatDate(new Date(user.mappingDate)) : '-',
    name: user.name ?? '-',
    position: user.position ?? '-',
    role: user.role ?? '-',
    userId: user.userId ?? '-',
  }));

  const tablePage = userUsageData?.page;

  return {
    isUserUsageLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tablePage,
  };
};

export default useTableUserAccess;
