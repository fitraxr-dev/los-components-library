'use client';

import { useMemo } from 'react';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';


export type SkuAccess = {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export const useSkuAccess = (): SkuAccess => {
  const canView = useCheckAccess(accessid.REASSIGNMENT_SKU_VIEW);
  const canCreate = useCheckAccess(accessid.REASSIGNMENT_SKU_CREATE);
  const canUpdate = useCheckAccess(accessid.REASSIGNMENT_SKU_UPDATE);
  const canDelete = useCheckAccess(accessid.REASSIGNMENT_SKU_DELETE);

  return useMemo(
    () => ({
      canCreate,
      canDelete,
      canUpdate,
      canView,
    }),
    [canView, canCreate, canUpdate, canDelete]
  );
};
