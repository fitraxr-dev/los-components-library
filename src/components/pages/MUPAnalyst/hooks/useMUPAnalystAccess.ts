'use client';

import { useMemo } from 'react';

import { positions } from '@/configs/constants';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';


export type ModuleAccess = {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canDownload: boolean;
};

export type UseMUPAnalystAccessReturn = {
  baseMUPAnalystAccess: ModuleAccess;
  isAnalyst: boolean;
};

const useModuleAccess = (prefix: string): ModuleAccess => ({
  canCreate: useCheckAccess(accessid[`${prefix}_CREATE`]),
  canDelete: useCheckAccess(accessid[`${prefix}_DELETE`]),
  canDownload: useCheckAccess(accessid[`${prefix}_DOWNLOAD`]),
  canUpdate: useCheckAccess(accessid[`${prefix}_UPDATE`]),
  canView: useCheckAccess(accessid[`${prefix}_VIEW`]),
});

export const useMUPAnalystAccess = (): UseMUPAnalystAccessReturn => {
  const [{ currentPosition }] = useApp();
  const isAnalyst = currentPosition?.includes(positions.ANALYST) || false;
  const baseMUPAnalystAccess = useModuleAccess('MUP_ANALYST');

  return useMemo(
    () => ({
      baseMUPAnalystAccess,
      isAnalyst,
    }),
    [baseMUPAnalystAccess, isAnalyst]
  );
};

export default useMUPAnalystAccess;
