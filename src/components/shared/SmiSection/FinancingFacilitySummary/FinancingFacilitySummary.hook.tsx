import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckFacility from '@/hooks/services/bucket/useCheckFacility';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useGetListFinancingFacility from './hooks/useGetListFinancingFacility';
import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


const outsideState = {
  remarkInitialValue: '',
};

export const useFinancingFacilitySummary = ({ module, process }) => {
  const goToNextStep = useGoToNextStep();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const path = usePathname();
  const processUrl = path.split('/')[2];
  const isAnalyst = processUrl?.includes('analyst');
  const { recordActivity } = useRecordLog();

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: String(processId),
    module,
    process,
  });

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [remark, setRemark] = useState(outsideState.remarkInitialValue);
  const [remarkIsEdited, setRemarkIsEdited] = useState(false);
  const hasShownFacilityAlert = useRef(false);

  const { data: checkFacilityData, isFetching: isCheckingFacility } = useCheckFacility({
    bucketProcessId: String(processId),
  }, false);

  const { data: facilityListData } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: String(processId),
      module,
      process,
    },
    page: {
      itemPerPage: 999,
      noPage: 1,
    },
  } as any);

  const hasIncompleteFacility = facilityListData?.contents?.some((item: any) => item?.alreadyUpdate === false);

  const {
    data: financingOverviewDetail,
    isFetching: isFetchLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: isAnalyst ? bucketDetail?.bucketParentId : String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  useEffect(() => {
    hasShownFacilityAlert.current = false;
  }, [processId]);

  useEffect(() => {
    if (!isCheckingFacility && checkFacilityData?.content?.isShowAlert === false) {
      hasShownFacilityAlert.current = false;
    }
  }, [checkFacilityData, isCheckingFacility]);

  useEffect(() => {
    if (isCheckingFacility) return;

    const isShowAlert = checkFacilityData?.content?.isShowAlert;
    const message = checkFacilityData?.content?.message;

    if (isShowAlert === true && !hasShownFacilityAlert.current) {
      hasShownFacilityAlert.current = true;
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        title: message || 'Harap lakukan kalkulasi ulang pada perhitungan BMPP',
      });
      console.log('show alert', message);
    }
  }, [checkFacilityData, isCheckingFacility]);

  useEffect(() => {
    const newRemark = financingOverviewDetail?.remark;

    if (newRemark) {
      outsideState.remarkInitialValue = newRemark;
      setRemark(newRemark);
    }
  }, [financingOverviewDetail]);

  useEffect(() => {
    if (!dirtyMsg) {
      setDirtyMsg(
        financingOverviewDetail?.remark === remark
          ? undefined
          : 'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.'
      );
    }

    setRemarkIsEdited(remark !== outsideState.remarkInitialValue);
  }, [remark]);

  const handleNext = () => {
    goToNextStep();

    queryClient.invalidateQueries({
      queryKey: ['bucket-stepper', { bucketProcessId: processId, module, process }],
    });
  };

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => (shouldGoNext ? handleNext() : null), type: 'success' });
    },
  });

  const handleSave = () => {
    if (viewOnly) {
      handleNext();

      return;
    }

    if (!remark) {
      showNiceModal('confirm', 'DATA MANDATORY belum terisi, simpan perubahan ?', () => handleNext(), 'Tidak', 'Ya');

      return;
    }

    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: String(processId),
      module,
      process,
      remarks: 'Save financing facility summary',
    });

    saveFinancingOverview({
      bucketProcessId: String(processId),
      id: financingOverviewDetail?.id ?? undefined,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remark,
    });
  };

  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketProcessId: String(processId),
      id: financingOverviewDetail?.id ?? undefined,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remark: remark,
    });
  }, [remark, processId, financingOverviewDetail]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.financingFacility.save',
  });

  return {
    financingOverviewDetail,
    handleNext,
    handleSave,
    hasIncompleteFacility,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    remark,
    remarkIsEdited,
    setRemark,
    setShouldGoNext,
  };
};
