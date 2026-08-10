'use client';
import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';

import useGetDetailUser from '../hooks/useGetDetailUser';


const useValidation = () => {
  const { actions, setBucketProcessIdForStepper, setIsUserDetailLoading } = useUserManagementContext();

  const { id }: {id: string} = useParams();
  const isHasProcessId = id && id.includes('UM-');
  const {
    data: detailUserData,
    isLoading: isDetailUserLoading,
    isSuccess: isDetailUserSuccess,
  } = useGetDetailUser({ userId: id });

  useEffect(() => {
    setIsUserDetailLoading(isDetailUserLoading);
  }, [isDetailUserLoading, setIsUserDetailLoading]);

  const bucketProcessId = detailUserData?.bucketProcessId;

  return {
    bucketProcessId,
    isHasProcessId,
  };
};

export default useValidation;
