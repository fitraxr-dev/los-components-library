import { useEffect } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import {
  maintenanceDebtor,
  maintenanceGroup,
  maintenanceModal,
  maintenanceSuratHutang,
} from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetStepMaintenance from './hooks/useGetStepMaintenance';


const useMaintenanceGroup = (onStepperClick?: (url: string) => void, hasUnsavedChanges?: boolean) => {
  const router = useCustomRouter();
  const path = usePathname();
  const { groupId } = useParams<{ groupId: string }>();
  const { memberId } = useParams<{ memberId: string }>();
  const { calculationId } = useParams<{ calculationId: string }>();
  const groupModule = groupId ? path.split('/')[4] : path.split('/')[3];
  const isSubmission = groupId?.includes('MG');
  const isEdit = path.includes('/edit');

  const ignorePath = [
    maintenanceGroup.LIST_PAGE,
  ];

  const pathArray = path.split('/');
  const params = useSearchParams();
  const additionalIgnorePath = [
    ...ignorePath,
    replacePath(maintenanceGroup.ADD_MEMBER_PAGE, {
      groupId: groupId,
    }),
    replacePath(maintenanceGroup.EDIT_MEMBER_PAGE, {
      groupId: groupId,
      memberId: memberId,
    }),
    replacePath(maintenanceGroup.DETAIL_MEMBER_PAGE, {
      groupId: groupId,
      memberId: memberId,
    }),
    replacePath(maintenanceGroup.BMPK_DETAIL_PAGE, {
      calculationId: calculationId,
      groupId: groupId,
      memberId: memberId,
    }),
    replacePath(maintenanceGroup.BMPP_CALCULATION_PAGE, {
      calculationId: calculationId,
      groupId: groupId,
    }),
  ];

  const isDetailPage = ignorePath.includes(path);
  const renderDetailLayout = additionalIgnorePath.includes(path);
  //|| params.get('from') !== null;


  const handleCustomStepperClick = (url: string) => {
    const navigationCallback = () => {
      if (onStepperClick) {
        onStepperClick(url);
      } else {
        router.push(replacePath(
          (groupModule === 'edit' ?
            `/maintenance-data/maintenance-group/${groupId}/edit/${url}` :
            groupModule === 'create' ?
              '/maintenance-data/maintenance-group/create/${url}' :
              `/maintenance-data/maintenance-group/${groupId}/detail/${url}`),
          { groupId: groupId }
        ));
      }
    };

    // Show confirmation modal if there are unsaved changes and navigating to validation
    if (hasUnsavedChanges && url === 'validation') {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          navigationCallback();
        },
        submitText: 'Ya',
        title: 'Apakah Anda yakin tidak save? Perubahan yang Anda buat tidak akan disimpan.',
        type: 'warning',
      });
    } else {
      navigationCallback();
    }
  };

  const { data: dataStep } = useGetStepMaintenance({
    bucketProcessId: groupId,
    module: 'MG',
    process: 'MG',
  });

  return {
    additionalIgnorePath,
    groupId,
    handleCustomStepperClick,
    isDetailPage,
    isEdit,
    isSubmission,
    renderDetailLayout,
    router,
  };
};

export default useMaintenanceGroup;
