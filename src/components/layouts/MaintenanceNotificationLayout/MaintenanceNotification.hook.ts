import { useEffect } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import {
  maintenanceDebtor,
  maintenanceGroup,
  maintenanceModal,
  maintenanceSuratHutang,
  maintenanceNotification,
} from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetStepMaintenance from './hooks/useGetStepMaintenance';

// perlu diubah path
const useMaintenanceNotification = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { groupId } = useParams<{ groupId: string }>();
  const { memberId } = useParams<{ memberId: string }>();
  const groupModule = groupId ? path.split('/')[4] : path.split('/')[3];
  const isSubmission = groupId?.includes('MG');
  const isEdit = path.includes('/edit');

  // cek role
  const [state, _] = useApp();
  const isRM = state.currentRole.includes(roles.RM);
  const isTL = state.currentRole.includes(roles.TL);


  const ignorePath = [
    maintenanceGroup.LIST_PAGE,
  ];

  const pathArray = path.split('/');
  const params = useSearchParams();

  const isDetailPage = path.includes('detail');
  const renderDetailLayout = isDetailPage;


  const { data: dataStep } = useGetStepMaintenance({
    bucketProcessId: groupId,
    module: 'MG',
    process: 'MG',
  });

  return {
    groupId,
    isDetailPage,
    isEdit,
    isRM,
    isSubmission,
    isTL,
    renderDetailLayout,
    router,
  };
};

export default useMaintenanceNotification;
