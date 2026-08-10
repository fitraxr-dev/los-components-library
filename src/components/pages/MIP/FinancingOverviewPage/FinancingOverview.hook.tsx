import {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useCheckFacility from '@/hooks/services/bucket/useCheckFacility';
import useGetDetailFinancingOverview from '@/hooks/services/mip/financing-facility/useGetDetailFinancingOverview';
import useSaveFinancingOverview from '@/hooks/services/mip/financing-facility/useSaveFinancingOverview';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';


export const useFinancingOverview = () => {
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const [remark, setRemark] = useState('');
  const [initialRemark, setInitialRemark] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const hasShownFacilityAlert = useRef(false);

  const {
    data: financingOverviewDetail,
    isLoading: isFinancingDetailLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: checkFacilityData, isFetching: isCheckingFacility, refetch: refetchCheckFacility } = useCheckFacility({
    bucketProcessId: String(processId),
  });

  const checkAndShowFacilityAlert = () => {
    if (isCheckingFacility) return;

    const isShowAlert = checkFacilityData?.content?.isShowAlert;
    const message = checkFacilityData?.content?.message;

    if (isShowAlert === true && !hasShownFacilityAlert.current) {
      hasShownFacilityAlert.current = true;
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        title: message || 'Harap lakukan kalkulasi ulang pada perhitungan BMPP',
      });
    }
  };

  useEffect(() => {
    hasShownFacilityAlert.current = false;
  }, [processId]);

  useEffect(() => {
    if (!isCheckingFacility && checkFacilityData?.content?.isShowAlert === false) {
      hasShownFacilityAlert.current = false;
    }
  }, [checkFacilityData, isCheckingFacility]);

  useEffect(() => {
    checkAndShowFacilityAlert();
  }, [checkFacilityData, isCheckingFacility]);

  useEffect(() => {
    if (financingOverviewDetail) {
      const initialValue = financingOverviewDetail?.remark || '';
      setRemark(initialValue);
      setInitialRemark(initialValue);
    }
  }, [financingOverviewDetail]);

  useEffect(() => {
    if (initialRemark !== undefined && remark !== initialRemark) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [remark, initialRemark, setDirtyMsg]);

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      setInitialRemark(remark);
      queryClient.invalidateQueries({
        queryKey: ['financing-overview'],
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketProcessId: String(processId),
      id: undefined,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
      remark: remark || '',
    });
  }, [processId, state.pages.mipModule, state.pages.mipProcess, remark]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'mip.financingFacility.save',
  });

  const handleSave = () => {
    if (viewOnly) {
      goToNextStep();
    } else {
      if (!!remark) {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: String(processId),
          changeAfter: JSON.stringify(remark),
          changeBefore: JSON.stringify(financingOverviewDetail),
          menuCode: 'mip',
          module: state.pages?.mipModule,
          process: state.pages?.mipProcess,
          remarks: `save detail financing overview from module ${state.pages?.mipModule}`,
        });
        saveFinancingOverview({
          bucketProcessId: String(processId),
          id: undefined,
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
          remark: remark,
        });
      } else {
        showNiceModalV2({
          cancelText: 'Tidak',
          onSubmit: () => {
            recordActivity({
              activity: ActivityType.SAVE,
              bucketProcessId: String(processId),
              changeAfter: JSON.stringify(remark),
              changeBefore: JSON.stringify(financingOverviewDetail),
              menuCode: 'mip',
              module: state.pages?.mipModule,
              process: state.pages?.mipProcess,
              remarks: `save detail financing overview from module ${state.pages?.mipModule}`,
            });
            saveFinancingOverview({
              bucketProcessId: String(processId),
              id: undefined,
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
              remark: '',
            });
          },
          submitText: 'Ya',
          title: 'Data mandatory belum terisi, simpan perubahan?',
          type: 'warning',
        });
      }
    }
  };

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    checkFacilityData,
    handleSave,
    hasShownFacilityAlert,
    isAutoSaveFetching,
    isCheckingFacility,
    isFinancingDetailLoading,
    isSaveLoading,
    remark,
    setRemark,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
  };
};
