import React, { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { RETURN_TO_MAKER, RETURN_TO_STAFF, RETURN_TO_TL, SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { loanProcessingSummary, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useStandaloneBucket from '@/hooks/services/useStandaloneBucket';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useLpsCoreContext } from '@/components/layouts/LpsLayoutCore/LpsLayoutCore.context';
import useGetDebtorById from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/hooks/useGetDebtorById';
import Button from '@/components/shared/Button';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';

import useSendToCore from './hooks/useSendToCore.hook';


const useFaciltyOverview = () => {
  const { actionButtons } = useLpsCoreContext();
  const [appState] = useApp();
  const currentRole = appState.currentRole;
  const currentDivision = appState.userData?.userDivision?.divisionCode;
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { processId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const goToNextStep = useGoToNextStep();
  const isRM = currentRole.includes('STAFF');
  const isMaker = currentRole.includes('MAKER');
  const isTL = currentRole.includes('TL');
  const [{ stepper }] = useApp();
  const { recordActivity } = useRecordLog();


  const handleNext = () => {
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
    goToNextStep();
  };

  const { data: debtorInfoData, isLoading: isBucketLoading, isFetching: isBucketFetching } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  React.useEffect(() => {
    if (!isBucketLoading && !isBucketFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'view facility overview page',
      });
    }
  }, [isBucketLoading, isBucketFetching, processId, recordActivity]);

  const { data: debtorDetail } = useGetDebtorById({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: !!(debtorInfoData?.debtorId),
  });

  const { mutate: saveDebtorDetail } = useStandaloneBucket({
    onError: (error: any) => {
      showNiceModalV2({
        title: error?.message,
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
    debtorId: debtorInfoData?.debtorId,
  }, {
    refetchOnMount: 'always',
  });

  const submitEnable = validateResult?.content?.isSubmitButtonEnable;
  const isBeingProcessed = validateResult?.content?.isAlertFacilityShow ?? false;
  const isFinancingFacilityDone = stepper?.steps?.find((s: any) => s.key === 'financing-facility')?.isDone;
  const isStepperComplete = stepper?.progress === 100;

  const { data: facilityListDataX } = useGetListFinancingPk(
    {
      filter: {
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
    },
    {
      bucketProcessId: parentId,
    },
    undefined,
    undefined,
    0
  );


  const facilityListData = useMemo(() => {
    return facilityListDataX
      ?.filter((res) => res !== undefined)
      ?.filter((res) => res?.pkName !== null);
  }, [facilityListDataX]);

  const isNominalMismatch = (() => {
    if (!facilityListData) return false;
    let numericTotalOrder = 0;
    let numericTotalOrderPk = 0;

    facilityListData.forEach((facility) => {
      numericTotalOrder += facility?.totalOrderValue ? facility?.totalOrderValue : 0;
      // @ts-ignore
      numericTotalOrderPk += facility?.totalOrderValuePk ? facility?.totalOrderValuePk : 0;
    });

    return numericTotalOrder !== numericTotalOrderPk;
  })();

  const { mutate: doSubmitLpsCore, isPending: isSubmitLoading } = useSubmitBucket({
    onError: (error: any) => {
      console.log('error', error);
      showNiceModalV2({ title: error?.message, type: 'error' });
    },
    onSuccess: (_, variables) => {
      console.log('variables', variables);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      if (variables?.submitRequestDto?.action === 'EDIT') {
        showNiceModalV2({
          title: '',
          type: 'success',
        });
        window.location.reload();
      } else {
        showNiceModalV2({
          onClose: () => {
            closeNiceModal(MODAL.GLOBAL.CONFIRM);
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            handleBackToTable();
          },
          title: 'Data berhasil dikirim',
          type: 'success',
        });
      }
    },
  });

  const { mutate: doSendToCore } = useSendToCore({
    onError: (error: any) => {
      console.log('error', error);
      showNiceModalV2({ title: error?.message, type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({
        onClose: () => {
          handleBackToTable();
        },
        title: 'Data berhasil dikirim',
        type: 'success',
      });
    },
  });

  const modifiedObject = !viewOnly ? { SAVE: 'SAVE' } : { NEXT: 'NEXT' };
  let isEdit = false;
  for (const key in actionButtons) {
    if (key.includes('APPROVE_ASK_FOR_INFO')) {
      if (actionButtons['APPROVE_ASK_FOR_INFO_BUSINESS']) {
        modifiedObject['APPROVE_ASK_FOR_INFO_MODAL'] = 'APPROVE_ASK_FOR_INFO_MODAL';
      } else {
        modifiedObject['APPROVE_ASK_FOR_INFO'] = actionButtons['APPROVE_ASK_FOR_INFO'];
      }
    } else if (key.includes('ASK_FOR_INFO_TL') || key.includes('ASK_FOR_INFO_BUSINESS')) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('SEND_TO_CORE')) {
      modifiedObject['SEND_TO_CORE'] = actionButtons[key];
    } else if (key.includes('EDIT')) {
      isEdit = true;
    } else if (key.includes('ASK_FOR_INFO')) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else {
      modifiedObject[key] = actionButtons[key];
    }
  }

  const handleBackToTable = () => {
    return router.replace(loanProcessingSummary.BUCKET_LPS_CORE);
  };

  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        doSubmitLpsCore({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_CORE,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan diubah dengan Penerbitan yang baru, Apakah anda yakin?',
    });
  };

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        recordActivity({
          activity: ActivityType.SUBMIT,
          bucketProcessId: processId,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_CORE,
          remarks: `submit facility overview: action=${action}`,
        });
        doSubmitLpsCore({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_CORE,
          },
        });
      },
    });
  };

  const handleSendToCore = (action: string) => {
    recordActivity({
      activity: ActivityType.SUBMIT,
      bucketProcessId: processId,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_CORE,
      remarks: 'send to core',
    });
    doSendToCore({
      sendToCoreRequestDto: {
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
      },
    });
  };

  const sortArray = () => {
    let arr: string[] = [];
    arr = [
      'NEXT',
      'SAVE',
      'RETURN_TO_STAFF',
      'RETURN_TO_TL',
      'RETURN_TO_MAKER',
      'SUBMIT',
      'SEND_TO_CORE',
    ];
    return arr;
  };

  const sortedKeys = sortArray().filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case RETURN_TO_STAFF:
        return (
          <Button
            color="darkBlue"
            disabled={isSubmitLoading}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit(value)}
          >
            Return to Staff
          </Button>
        );
      case RETURN_TO_TL:
        return (
          <Button
            color="info"
            disabled={isSubmitLoading}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit(value)}
          >
            Return to TL
          </Button>
        );
      case RETURN_TO_MAKER:
        return (
          <Button
            color="info"
            disabled={isSubmitLoading}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit(value)}
          >
            Return to Maker
          </Button>
        );
      case 'SEND_TO_CORE':
        return (
          <Button
            color="success"
            disabled={isSubmitLoading || isNominalMismatch}
            isLoading={isSubmitLoading}
            onClick={() => handleSendToCore(value)}
          >
            Send to Core
          </Button>
        );
      case SUBMIT:
        return (
          <Button
            color="success"
            disabled={
              isSubmitLoading ||
              !submitEnable ||
              !isFinancingFacilityDone ||
              !isStepperComplete ||
              isNominalMismatch
            }
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit(value)}
          >
            {(isRM || isTL || isMaker) ? 'Submit' : 'Approve'}
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => handleNext()}
          >
            Next
          </Button>
        );
    }
  };


  return {
    actionButtons,
    handleButton,
    handleEdit,
    handleFacilityManagement,
    isBeingProcessed,
    isEdit,
    isNominalMismatch,
    isShowFacilityManagement: actionButtons?.['FACILITY'],
    isSubmitLoading,
    sortedObject,
    viewOnly,
  };
};

export default useFaciltyOverview;
