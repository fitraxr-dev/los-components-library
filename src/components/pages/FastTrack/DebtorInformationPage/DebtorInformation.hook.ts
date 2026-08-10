import { useEffect, useState, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { fastTrack, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetExposureDebtor from '@/hooks/services/bucket/debtor/useGetExposureDebtor';
import useGetExposureGroup from '@/hooks/services/bucket/debtor/useGetExposureGroup';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterByModuleCustom from '@/hooks/services/useGetParameterByModuleCustom';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';

import useGetSimiliarProcess from '../../ApuPpt/DebtorProfileInformationPage/hooks/useGetSimiliarProcess';
import { getParameterList } from '../../MaintenanceParameter/hooks/constant';

import useGetActivationPopUp from './hooks/useGetActivationPopUp';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { divisionCode } = useDivision();
  const { recordActivity } = useRecordLog();

  const { isRequestModule } = useFastTrackContext();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();

  const [hasModalShown, setHasModalShown] = useState(false);
  const isDpop = divisionCode === 'DPOP_DIVISION';

  const { data: typeSubmission } = useGetParameterList('typeSubmission');
  console.log(typeSubmission, 'typeSubmission');

  const {
    data: bucketDetail,
    isLoading: bucketDetailIsLoading,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });
  const isGroup = debtorInfoData?.isGroup;

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  const { data: totalExposure } = useGetExposureDebtor({
    bucketProcessId: processId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });

  const formattedTotalExposure = useMemo(() => {
    if (!totalExposure) return [];

    return [
      {
        currency: 'IDR',
        label: 'Plafond Existing',
        value: totalExposure?.plafondExisting?.idr || '0',
        viewOnly: true,
      },
      {
        currency: 'USD',
        label: 'Plafond Existing',
        value: totalExposure?.plafondExisting?.usd || '0',
        viewOnly: true,
      },
      {
        currency: 'IDR',
        label: 'O/S',
        value: totalExposure?.outstanding?.idr || '0',
        viewOnly: true,
      },
      {
        currency: 'USD',
        label: 'O/S',
        value: totalExposure?.outstanding?.usd || '0',
        viewOnly: true,
      },
      {
        currency: 'IDR',
        label: 'Propose',
        value: totalExposure?.propose?.idr || '0',
        viewOnly: true,
      },
      {
        currency: 'USD',
        label: 'Propose',
        value: totalExposure?.propose?.usd || '0',
        viewOnly: true,
      },
    ];
  }, [totalExposure]);

  const { data: groupExposure } = useGetExposureGroup({
    bucketProcessId: processId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });
  console.log(groupExposure, 'groupExposure');

  const { data: similiarProcessData, isLoading: isLoadingSimiliar, isSuccess: isSuccesSimi } = useGetSimiliarProcess({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  useEffect(() => {
    if (bucketDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.FAST_TRACK,
        process: TypeProcess.FAST_TRACK,
        remarks: 'view fast track debtor information page',
      });
    }
  });

  const handleLatest = () => {
    const path = replacePath(
      fastTrack.DETAIL_REQUEST_PAGE,
      {
        processId: isDpop ? similiarProcessData?.content?.bucketProcessId :
          similiarProcessData?.content?.bucketParentId,
      });
    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };

  const checkBtn = (similiarProcessData) => {
    let btn = [];

    if (isSuccesSimi && !!similiarProcessData?.content) {
      btn.push({
        color: 'primary',
        disabled: !similiarProcessData?.content,
        iconName: 'show',
        isLoading: isLoadingSimiliar,
        label: 'View The Latest Fast Track',
        onClick: handleLatest,
      });
    }

    return btn;
  };

  const handleClickViewRequest = () => {
    const path = replacePath(fastTrack.DETAIL_REQUEST_PAGE, {
      processId: bucketDetail.bucketParentId,
    });

    window.open(setPreviewPage(path), '_blank', 'noopener, noreferrer');
  };

  const handleViewMaintenanceCustomer = () => {
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      { debtorId: bucketDetail?.debtorId, from: 'fast-track', module: 'maintenance' },
    );
    router.push(path);
  };

  const handleNext = () => {
    goToNextStep();
    queryClient.invalidateQueries({
      queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: TypeModule.FAST_TRACK,
        process: TypeProcess.FAST_TRACK,
      }],
    });
  };

  const {
    data: popUp,
  } = useGetActivationPopUp({
    debtorId: bucketDetail?.debtorId,
  });

  useEffect(() => {
    if (popUp && popUp.invalid && !hasModalShown) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        cancelText: 'Close',
        title: popUp.result,
      });
      setHasModalShown(true);
    }
  }, [popUp, hasModalShown]);


  return {
    bucketDetail,
    bucketDetailIsLoading,
    checkBtn,
    groupExposure,
    handleClickViewRequest,
    handleNext,
    handleViewMaintenanceCustomer,
    isDpop,
    isGroup,
    isRequestModule,
    isValidateSuccess,
    similiarProcessData,
    totalExposure: formattedTotalExposure,
    typeSubmission,
    validateResult,
  };
};

export default useDebtorInformation;
