import { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useStandaloneBucket from '@/hooks/services/useStandaloneBucket';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';

import useGetDebtorById from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/hooks/useGetDebtorById';


const useFaciltyOverview = () => {
  const queryClient = useQueryClient();
  const [appState] = useApp();
  const { processId, setDebtorId } = useIdentity();
  const goToNextStep = useGoToNextStep();
  const router = useRouter();
  const path = usePathname();
  const lastPath = getLastPath(path);
  const stepper = appState.stepper;

  const actionButtons = useMemo(() => {
    return stepper.steps?.find((step: any) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;
  }, [stepper, lastPath]);

  const handleNext = () => {
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});

    goToNextStep();
  };

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });

  const debtorId = useMemo(() => {
    return bucketDetail?.debtorId;
  }, [bucketDetail]);

  useEffect(() => {
    if (debtorId) {
      setDebtorId(debtorId);
    }
  }, [debtorId]);

  const { data: debtorDetail, isLoading: isLoadingDebtorDetail } = useGetDebtorById({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: !!bucketDetail?.debtorId,
  });

  const { mutate: saveDebtorDetail } = useStandaloneBucket({
    onError() {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess(data) {
      window.open(replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_PAGE, {
        debtorId: data.content.bucketProcessId,
        module: 'maintenance',
      }), '_blank');
      window.location.reload();
    },
  });

  const handleFacilityManagement = () => {
    saveDebtorDetail({
      debtorId: debtorDetail?.debtorId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
    });
  };

  const { data: validateResult } = useGetValidateResult({
    debtorId: debtorDetail?.debtorId,
  }, {
    enabled: debtorDetail?.debtorId !== null && debtorDetail?.debtorId !== undefined,
  });

  const isBeingProcessed = validateResult?.content?.isAlertFacilityShow ?? false;

  return {
    handleFacilityManagement,
    handleNext,
    isBeingProcessed,
    isShowFacilityManagement: actionButtons?.['FACILITY'],
  };
};

export default useFaciltyOverview;
