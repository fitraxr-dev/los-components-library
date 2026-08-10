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

export type UseMUPAccessReturn = {
  baseMUPAccess: ModuleAccess;
  analystMUPAccess: ModuleAccess;
  isAnalyst: boolean;
};

const useModuleAccess = (prefix: string): ModuleAccess => ({
  canCreate: useCheckAccess(accessid[`${prefix}_CREATE`]),
  canDelete: useCheckAccess(accessid[`${prefix}_DELETE`]),
  canDownload: useCheckAccess(accessid[`${prefix}_DOWNLOAD`]),
  canUpdate: useCheckAccess(accessid[`${prefix}_UPDATE`]),
  canView: useCheckAccess(accessid[`${prefix}_VIEW`]),
});

export const useMUPAccess = (): UseMUPAccessReturn => {
  const [{ currentPosition }] = useApp();

  const isAnalyst = currentPosition?.includes(positions.ANALYST) || false;

  const baseMUPAccess = useModuleAccess('MUP');
  const analystMUPAccess = useModuleAccess('MUP_ANALYST');

  return useMemo(
    () => ({
      analystMUPAccess,
      baseMUPAccess,
      isAnalyst,
    }),
    [baseMUPAccess, analystMUPAccess, isAnalyst]
  );
};

export default useMUPAccess;
