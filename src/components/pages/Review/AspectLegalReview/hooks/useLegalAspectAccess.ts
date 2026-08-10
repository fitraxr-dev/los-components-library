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

export type UseLegalAspectAccessReturn = {
  list: ModuleAccess;
  assignment: ModuleAccess;
  monitoring: ModuleAccess;
  hasAnyViewAccess: boolean;
  hasAnyCreateAccess: boolean;
  hasAnyUpdateAccess: boolean;
  hasAnyDeleteAccess: boolean;
  hasAnyDownloadAccess: boolean;
};

const useModuleAccess = (prefix: string): ModuleAccess => {
  const canView = useCheckAccess(accessid[`${prefix}_VIEW`]);
  const canCreate = useCheckAccess(accessid[`${prefix}_CREATE`]);
  const canUpdate = useCheckAccess(accessid[`${prefix}_UPDATE`]);
  const canDelete = useCheckAccess(accessid[`${prefix}_DELETE`]);
  const canDownload = useCheckAccess(accessid[`${prefix}_DOWNLOAD`]);

  return useMemo(
    () => ({
      canCreate,
      canDelete,
      canDownload,
      canUpdate,
      canView,
    }),
    [canView, canCreate, canUpdate, canDelete, canDownload]
  );
};

export const useLegalAspectAccess = (): UseLegalAspectAccessReturn => {
  const list = useModuleAccess('LIST_LEGAL_ASPECT_REVIEW');
  const assignment = useModuleAccess('ASSIGNMENT_LEGAL_ASPECT_REVIEW');
  const monitoring = useModuleAccess('MONITORING_LEGAL_ASPECT_REVIEW');

  return useMemo(
    () => ({
      assignment,
      hasAnyCreateAccess: list.canCreate || assignment.canCreate || monitoring.canCreate,
      hasAnyDeleteAccess: list.canDelete || assignment.canDelete || monitoring.canDelete,
      hasAnyDownloadAccess: list.canDownload || assignment.canDownload || monitoring.canDownload,
      hasAnyUpdateAccess: list.canUpdate || assignment.canUpdate || monitoring.canUpdate,
      hasAnyViewAccess: list.canView || assignment.canView || monitoring.canView,
      list,
      monitoring,
    }),
    [list, assignment, monitoring]
  );
};

export default useLegalAspectAccess;
