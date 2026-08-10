'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import useGetBusinessGroup from '../../hooks/useGetBusinessGroup';


export const useBusinessGroupTable = () => {
  const { processId } = useIdentity();

  const { data: businessGroupListContents, isLoading: businessGroupListLoading } = useGetBusinessGroup({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.LEGAL_SIGNING,
  });

  return {
    businessGroupListContents,
    businessGroupListLoading,
  };
};
