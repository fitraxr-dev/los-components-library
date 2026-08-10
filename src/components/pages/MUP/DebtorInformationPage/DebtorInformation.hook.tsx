import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor, mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckRequest from '@/hooks/services/bucket/debtor/useCheckRequest';
import useGetDebtorDetail from '@/hooks/services/bucket/debtor/useGetDebtorDetail';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketProcessMip from '@/hooks/services/useGetBucketProcessMip';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import Button from '@/components/shared/Button';

import { useMUPAccess } from '../hooks/useMUPAccess';

import { modal } from './components/ModalRequestOtherProcess/ModalRequestOtherProcess.constants';
import { REQUEST_OTHER_PROCESS } from './DebtorInformation.constants';
import useSaveCreditor from './hooks/useSaveCreditor';
import useSaveDebtorInformation from './hooks/useSaveDebtorInformation';


import type { BucketDetailRequestDto } from '@/services/openapi/bucket-service';
import type { CreditorRequestDto } from '@/services/openapi/mip-service';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const { goToNextStep, actionButtons } = useMUPContext();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const [isFetching, setIsFetching] = useState(true);


  const { recordActivity } = useRecordLog();

  const createPayload = (formData: BucketDetailRequestDto) => ({
    analystId: debtorDetail?.debtor?.analystId,
    bucketProcessId: processId,
    controllingParty: formData.controllingParty ?? null,
    dataSource: debtorInfoData?.dataSource,
    eirr: formData.eirr ?? null,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
    remarks: debtorDetail?.description,
    technicalMeetingDate: formData.technicalMeetingDate ?? null,
    typeFinancing: debtorDetail?.debtor?.typeFinancing,
    typeProcess: debtorDetail?.debtor?.typeProcess,
    typeSubmission: debtorDetail?.debtor?.typeProposal,
  });

  const recordSaveActivity = (payload: BucketDetailRequestDto) => {
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify(payload),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `update debtor information for ${debtorDetail?.debtor?.debtorName}`,
    });
  };

  const { baseMUPAccess, isAnalyst } = useMUPAccess();
  const isViewOnlyMode = viewOnly || isAnalyst || !baseMUPAccess.canUpdate;

  const { data: debtorDetail } = useGetDebtorDetail({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  }, { enabled: !!processId });

  const form = useForm({
    defaultValues: {
      controllingParty: '',
      creditorName: '',
      creditorType: '',
      eirr: '',
      technicalMeetingDate: '',
    },
    mode: 'onChange',
  });
  const { watch } = form;

  const isGroup = debtorDetail?.debtor?.isGroup;

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { data: checkRequestData } = useCheckRequest({
    bucketMasterId: debtorInfoData?.bucketMaster,
    process: TypeProcess.MUP,
  });

  const isPemda =
    (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(debtorInfoData?.institutionType);

  const miprId = debtorInfoData?.bucketParentId;

  const { data: miprBucketData } = useGetBucketById({
    bucketProcessId: String(miprId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  }, {
    enabled: !!miprId,
  });

  const isChangeMIPR = miprBucketData?.['isChangeMIPR'];

  const { data: dataProcessMip, isError } = useGetBucketProcessMip({
    bcmId: debtorInfoData?.bucketMaster,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  }, {
    enabled: !!debtorInfoData?.bucketMaster,
  });

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
        process: TypeProcess.MUP,
      };
      saveCreditor(payloadCreditor);
    },
  });

  const { mutate: saveDebtorForSave } = useSaveDebtorInformation({
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
        process: TypeProcess.MUP,
      };
      saveCreditorForSave(payloadCreditor);
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
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ creditorName: watch().creditorName, creditorType: watch().creditorType }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: `successfully saved creditor information for ${debtorDetail?.debtor?.debtorName}`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: processId,
            module: TypeModule.MUP,
            process: TypeProcess.MUP,
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

  const { mutate: saveCreditorForSave } = useSaveCreditor({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ creditorName: watch().creditorName, creditorType: watch().creditorType }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: `successfully saved creditor information for ${debtorDetail?.debtor?.debtorName}`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: processId,
            module: TypeModule.MUP,
            process: TypeProcess.MUP,
          }],
        });
      }, 1000);
      showNiceModalV2({
        type: 'success',
      });
    },
  });

  const handleSave = (formData: BucketDetailRequestDto) => {
    const payload = createPayload(formData);
    recordSaveActivity(payload);
    saveDebtorForSave(payload);
  };

  const handleSaveAndNext = (formData: BucketDetailRequestDto) => {
    const payload = createPayload(formData);
    recordSaveActivity(payload);
    saveDebtor(payload);
  };

  const handleOpenModalRequestOther = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ modal: 'REQUEST_OTHER_PROCESS' }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `open request other process modal for ${debtorDetail?.debtor?.debtorName}`,
    });
    NiceModal.show(modal.REQUEST_OTHER_PROCESS);
  };


  useEffect(() => {
    if (debtorDetail && dataProcessMip) setIsFetching(false);
  }, [debtorDetail, dataProcessMip]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ page: 'MUP Debtor Information' }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'view MUP debtor information page',
    });
  }, [recordActivity, processId, isAnalyst]);

  const handleViewMip = () => {
    if (isError) return showNiceModalV2({
      title: 'Gagal Halaman yang dituju tidak ditemukan',
      type: 'error',
    });

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ destination: 'MIP', processId: dataProcessMip?.bucketProcessId }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `view related MIP information for ${debtorDetail?.debtor?.debtorName}`,
    });

    const mipUrl = replacePath(mip.CUSTOMER_INFORMATION_PAGE, { processId: dataProcessMip?.bucketProcessId });
    window.open(mipUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewMipReview = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ destination: 'MIP Review', processId: debtorInfoData?.bucketParentId }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `view related MIP Review information for ${debtorDetail?.debtor?.debtorName}`,
    });

    const mipReviewUrl = replacePath(mip.CUSTOMER_INFORMATION_PAGE, { processId: debtorInfoData?.bucketParentId });
    window.open(mipReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRouteMaintenanceDebitor = () => {

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ debtorId: debtorInfoData?.debtorId, destination: 'Maintenance Debtor' }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `navigate to maintenance debtor page for ${debtorDetail?.debtor?.debtorName}`,
    });
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      {
        debtorId: debtorInfoData?.debtorId,
        from: 'mup',
        module: 'maintenance',
      });

    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const buttonDictionary = [REQUEST_OTHER_PROCESS];

  const renderActionButtons = () => {
    if (JSON.stringify(actionButtons) === '{}') {
      return null;
    }

    let buttonContents = [];

    for (const key in actionButtons) {
      if (buttonDictionary.includes(key)) {
        const indexByKeyInButtonDictionary = buttonDictionary.indexOf(key);
        buttonContents[indexByKeyInButtonDictionary] = [key, actionButtons[key]];
      }
    }

    const buttonList = buttonContents.map((button) => {
      const [key] = button;
      if (key === REQUEST_OTHER_PROCESS) {
        return (
          <Button
            key={key}
            color="success"
            disabled={isViewOnlyMode}
            onClick={handleOpenModalRequestOther}
          >
            Request Other Process
          </Button>
        );
      }
    });

    return buttonList;
  };

  const watchedValues = watch();

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    if (!debtorDetail || !debtorInfoData) {
      return Promise.resolve(null);
    }

    const payload = {
      analystId: debtorDetail?.debtor?.analystId,
      bucketProcessId: processId,
      controllingParty: watchedValues.controllingParty ?? null,
      dataSource: debtorInfoData?.dataSource,
      eirr: watchedValues.eirr ?? null,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: debtorDetail?.description,
      technicalMeetingDate: watchedValues.technicalMeetingDate ?? null,
      typeFinancing: debtorDetail?.debtor?.typeFinancing,
      typeProcess: debtorDetail?.debtor?.typeProcess,
      typeSubmission: debtorDetail?.debtor?.typeProposal,
    };

    return Promise.resolve(payload);
  }, [watchedValues, debtorDetail, debtorInfoData, processId]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnlyMode &&
              !!processId,
    payload: autoSavePayload,
    url: 'bucket.mup.saveDebtor',
  });


  return {
    checkRequestData,
    form,
    handleRouteMaintenanceDebitor,
    handleSave,
    handleSaveAndNext,
    handleViewMip,
    handleViewMipReview,
    isAnalyst,
    isAutoSaveFetching,
    isChangeMIPR,
    isFetching,
    isGroup,
    isPemda,
    isValidateSuccess,
    isViewOnlyMode,
    recordActivity,
    renderActionButtons,
    validateResult,
    viewOnly,
  };
};

export default useDebtorInformation;
