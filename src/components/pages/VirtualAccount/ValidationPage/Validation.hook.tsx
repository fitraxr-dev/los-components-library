'use client';
import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { virtualAccount } from '@/configs/constants/pathname';
import useIdentity from '@/hooks/useIdentity';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';


const useValidation = () => {
  const router = useRouter();
  const { processId } = useIdentity();
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];

  const handleCancel = () => {
    router.push(virtualAccount.VA_LIST);
  };
  return {
    bucketProcessId,
    handleCancel,
  };
};

export default useValidation;
