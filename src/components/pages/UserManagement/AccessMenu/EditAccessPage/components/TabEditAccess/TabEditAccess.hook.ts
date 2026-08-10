import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import useGetAccessMenuDetail from '@/components/pages/UserManagement/hooks/useGetAccessMenuDetail';

import useGetApprovalDetail from '../../../hooks/useGetApprovalDetail';


const useTabEditAccess = () => {
  const { isApproval, idParams } = useUserManagementContext();

  const forms = useForm({
    defaultValues: {
      accessMenu: [],
      accessMenuList: [],
      accessMenuName: '',
    },
    mode: 'onChange',
  });

  const { reset } = forms;

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

  useEffect(() => {
    if (isDetailSuccess) {
      reset({
        accessMenu: accesMenuDetailData.menuItems,
        accessMenuList: accesMenuDetailData.searchSelected,
        accessMenuName: accessMenuDetail.name,
      });
    }
  }, []);

  return {
    forms,
  };
};

export default useTabEditAccess;
