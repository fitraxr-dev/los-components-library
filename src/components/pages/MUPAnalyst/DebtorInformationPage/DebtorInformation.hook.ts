import { useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDebtorDetail from '@/hooks/services/bucket/debtor/useGetDebtorDetail';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketProcessMip from '@/hooks/services/useGetBucketProcessMip';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';

import { modal } from './components/ModalRequestOtherProcess/ModalRequestOtherProcess.constants';
import useSaveCreditor from './hooks/useSaveCreditor';
import useSaveDebtorInformation from './hooks/useSaveDebtorInformation';

import type { BucketDetailRequestDto } from '@/services/openapi/bucket-service';
import type { CreditorRequestDto } from '@/services/openapi/mip-service';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const { goToNextStep, bucketParentId } = useMUPAnalystContext();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const canUpdate = baseMUPAnalystAccess.canUpdate;
  const canView = baseMUPAnalystAccess.canView;

  const { data: debtorDetail, pending: isLoadingDetail } = useGetDebtorDetail({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  }, { enabled: !!processId });

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  });

  const bcmId = debtorInfoData?.bucketMaster;
  const form = useForm({
    defaultValues: {
      controllingParty: '',
      creditorName: '',
      creditorType: '',
      technicalMeetingDate: '',
    },
    mode: 'onChange',
  });
  const { watch } = form;

  const isPemda =
      (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(debtorInfoData?.institutionType);

  const { data: dataProcessMip, isError, isLoading: isMipLoading } = useGetBucketProcessMip({
    bcmId: bcmId,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  }, {
    enabled: !!bcmId,
  }
  );

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: !!debtorInfoData?.debtorId,
  });

  const { mutate: saveDebtor } = useSaveDebtorInformation({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      const payloadCreditor: CreditorRequestDto = {
        bucketProcessId: processId,
        creditorName: watch().creditorName,
        creditorType: watch().creditorType,
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
      };
      saveCreditor(payloadCreditor);
    },
  });

  const { mutate: saveCreditor } = useSaveCreditor({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: processId,
            module: TypeModule.MUP,
            process: TypeProcess.MUP_ANALYST,
          }],
        });
      }, 1000);
      showNiceModalV2({
        onClose: () => {
          goToNextStep();
        }, type: 'success',
      });
    },
  });

  const handleSave = async (shouldSave: boolean = false) => {
    if (shouldSave) {
      const formData = form.getValues();
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          action: 'Saved Debtor Information data and proceeding to next step',
          component: 'DebtorInformationPage',
          formData: {
            controllingParty: formData.controllingParty,
            technicalMeetingDate: formData.technicalMeetingDate,
          },
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'Saved Debtor Information and proceeding to next step',
      });

      const payload: BucketDetailRequestDto = {
        analystId: debtorDetail?.debtor?.analystId,
        bucketProcessId: processId,
        controllingParty: formData.controllingParty ?? null,
        dataSource: debtorInfoData?.dataSource,
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: debtorDetail?.description,
        technicalMeetingDate: formData.technicalMeetingDate ?? null,
        typeFinancing: debtorDetail?.debtor?.typeFinancing,
        typeProcess: debtorDetail?.debtor?.typeProcess,
        typeSubmission: debtorDetail?.debtor?.typeProposal,
      };
      saveDebtor(payload);
    } else {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          action: 'Navigating to next step in view-only mode',
          component: 'DebtorInformationPage',
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'Moving to next step from Debtor Information page',
      });
      goToNextStep();
    }
  };

  const handleOpenModalRequestOther = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: 'Opened Request Other Process modal',
        component: 'DebtorInformationPage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'Opening Request Other Process modal',
    });

    NiceModal.show(modal.REQUEST_OTHER_PROCESS);
  };


  useEffect(() => {
    if (!baseMUPAnalystAccess.canView) {
      return;
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: 'Initialize Debtor Information page',
        component: 'DebtorInformationPage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'Initialize Debtor Information page',
    });
  }, [processId, recordActivity, baseMUPAnalystAccess.canView]);

  const handleViewMip = () => {
    if (isError) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          action: 'Failed to navigate to MIP page - page not found',
          component: 'DebtorInformationPage',
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'Failed to navigate to MIP page',
      });

      return showNiceModalV2({
        title: 'Gagal Halaman yang dituju tidak ditemukan',
        type: 'error',
      });
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: 'Opening MIP Customer Information page in new tab',
        component: 'DebtorInformationPage',
        targetProcessId: dataProcessMip?.bucketProcessId,
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'Opening MIP Customer Information page in new tab',
    });

    const mipUrl = replacePath(mip.CUSTOMER_INFORMATION_PAGE, { processId: dataProcessMip?.bucketProcessId });
    window.open(mipUrl, '_blank', 'noopener,noreferrer');
  };

  const isLoading = isLoadingDetail || isMipLoading;

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    if (!debtorDetail || !debtorInfoData) {
      return Promise.resolve(null);
    }

    const formData = form.getValues();


    const payload = {
      analystId: debtorDetail?.debtor?.analystId,
      bucketProcessId: processId,
      controllingParty: formData.controllingParty ?? null,
      dataSource: debtorInfoData?.dataSource,
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: debtorDetail?.description,
      technicalMeetingDate: formData.technicalMeetingDate ?? null,
      typeFinancing: debtorDetail?.debtor?.typeFinancing,
      typeProcess: debtorDetail?.debtor?.typeProcess,
      typeSubmission: debtorDetail?.debtor?.typeProposal,
    };

    return Promise.resolve(payload);
  }, [debtorDetail, debtorInfoData, processId, form]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly &&
                !!processId,
    payload: autoSavePayload,
    url: 'bucket.mup.save',
  });

  return {
    canUpdate,
    canView,
    form,
    handleOpenModalRequestOther,
    handleSave,
    handleViewMip,
    isAutoSaveFetching,
    isLoading,
    isPemda,
    isValidateSuccess,
    validateResult,
    viewOnly,
  };
};

export default useDebtorInformation;
