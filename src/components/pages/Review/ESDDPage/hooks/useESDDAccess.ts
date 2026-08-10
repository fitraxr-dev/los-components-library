'use client';

import { useMemo } from 'react';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';


export type ModuleAccess = {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canDownload: boolean;
};

export type UseESDDAccessReturn = {
  assignment: ModuleAccess;
  bucketList: ModuleAccess;
  monitoring: ModuleAccess;
  hasAnyViewAccess: () => boolean;
  hasAnyCreateAccess: () => boolean;
  hasAnyUpdateAccess: () => boolean;
  hasAnyDeleteAccess: () => boolean;
  hasAnyDownloadAccess: () => boolean;
};

const useModuleAccess = (prefix: string): ModuleAccess => ({
  canCreate: useCheckAccess(accessid[`${prefix}_CREATE`]),
  canDelete: useCheckAccess(accessid[`${prefix}_DELETE`]),
  canDownload: useCheckAccess(accessid[`${prefix}_DOWNLOAD`]),
  canUpdate: useCheckAccess(accessid[`${prefix}_UPDATE`]),
  canView: useCheckAccess(accessid[`${prefix}_VIEW`]),
});

export const useESDDAccess = (): UseESDDAccessReturn => {
  const assignment = useModuleAccess('ESDD_ASSIGNMENT');
  const bucketList = useModuleAccess('ESDD_BUCKET_LIST');
  const monitoring = useModuleAccess('ESDD_MONITORING');

  return useMemo(
    () => ({
      assignment,
      bucketList,
      hasAnyCreateAccess: () =>
        assignment.canCreate || bucketList.canCreate || monitoring.canCreate,
      hasAnyDeleteAccess: () =>
        assignment.canDelete || bucketList.canDelete || monitoring.canDelete,
      hasAnyDownloadAccess: () =>
        assignment.canDownload || bucketList.canDownload || monitoring.canDownload,
      hasAnyUpdateAccess: () =>
        assignment.canUpdate || bucketList.canUpdate || monitoring.canUpdate,
      hasAnyViewAccess: () =>
        assignment.canView || bucketList.canView || monitoring.canView,
      monitoring,
    }),
    [assignment, bucketList, monitoring]
  );
};

export default useESDDAccess;
