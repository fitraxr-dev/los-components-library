'use client';
import React, { useContext, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  ASK_FOR_INFO_RESPONSE_RETURN_TO_STAFF,
  ASK_FOR_INFO_RESPONSE_RETURN_TO_TL,
  BAST_DONE,
  COMPLETED,
  DPOP_DIVISION,
  REJECTED_FROM_ELO,
  RETURN_TO_MAKER,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  roles,
  SUBMIT,
  ASK_FOR_INFO_SUMMARY_KADIV,
  ASK_FOR_INFO_SUMMARY_TL,
  WAITING_ASK_FOR_INFO_APPROVAL_KADIV_RESPONSE,
  WAITING_ASK_FOR_INFO_APPROVAL_TL_RESPONSE,
  WAITING_ASK_FOR_INFO_RESPONSE,
  WAITING_CIF,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { loanProcessingSummary } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';
import Button from '@/components/shared/Button';

import useGetAdditionalinformationById from './hooks/useGetAdditionalInformationById';
import useGetAdditionalInformationByIdDpop from './hooks/useGetAdditionalInformationByIdDpop';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';
import useSaveAdditionalInformationDpop from './hooks/useSaveAdditionalInformationDpop';
import useSendToElo from './hooks/useSendToElo';


const useAdditionalInformation = () => {
  const {
    isDivisiBisnis,
    actionButtons,
    stepperStatus,
    isDocumentSelected,
    isSuperAdmin,
    isChecker,
    isMaker,
  } = useLpsBastContext();
  const [user] = useApp();
  const router = useCustomRouter();
  const [container, setContainer] = useState(null);
  const [containerDpop, setContainerDpop] = useState(null);
  const { viewOnly } = useViewOnly();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();
  const [isIconEdit, setIsIconEdit] = useState<boolean>(false);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId, parentId } = useIdentity();
  const { divisionCode } = useDivision();
  const { recordActivity } = useRecordLog();
  const dpop = DPOP_DIVISION;
  const isDivisiDpop = divisionCode.includes(dpop);
  const isRm = user.currentRole.includes(roles.RM);
  const isTL = user.currentRole.includes(roles.TL) || user.currentRole.includes(roles.TL_ANALYST);
  const isKadivBisnis = user.currentRole.includes(roles.KADIV) && isDivisiBisnis;
  const isTLBisnis = user.currentRole.includes(roles.TL) && isDivisiBisnis;
  const isProcessDpop = String(processId).includes('LPSBD');
  const isBastDpop = (!isSuperAdmin && !isDivisiBisnis) || (isSuperAdmin && isProcessDpop);
  const process = isBastDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST;
  const [{ stepper }] = useApp();

  const checkSynfusionByStatus = () => {
    const listStatus = [
      // 1. Kondisi sebelum kirim ke DPOP add info di bisnis syncfusion hanya 1
      {
        isShowSynfusion: false,
        status: 'LPS_BAST',
      },
      // 2. Bisnis sudah kirim ke DPOP dan DPOP Confirm add info di bisnis suncf syncfusion sejumlah 2
      {
        isShowSynfusion: true,
        status: 'COMPLETED',
      },
      // 3. Jika binis melakukan BAST DONE (Tidak kirim ke DPOP) add info dibisnis syncfusion tetap 1
      {
        // TODO  BE akan membuat status key baru "COMPLETED_BAST_DONE"
        isShowSynfusion: true,
        status: 'COMPLETED', // klo sudah di adjust dari be value ini adalah false
      }
    ];
    const showSynfusionDpop = listStatus?.find((item) =>
      item.status === stepperStatus)?.isShowSynfusion;

    return {
      showSynfusionDpop,
    };
  };
  const { showSynfusionDpop } = checkSynfusionByStatus();


  const { data: childList, isSuccess } = useGetBucketChildList({
    filter: {
      bucketParent: processId,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
    },
    page: {
      itemPerPage: 20,
      noPage: 1,
    },
  },
  {
    enabled: showSynfusionDpop,
  });

  const bucketIdDpop = showSynfusionDpop && isSuccess
    ? childList?.contents?.find((item) => item.bucketParentId === processId)?.bucketProcessId
    : processId;

  const {
    data: additionalInformationBusiness,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useGetAdditionalinformationById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
  }
  );

  const {
    data: additionalInformationDpop,
    isFetching: isAddInfoDpopFetching,
    isLoading: isAddInfoDpopLoading,
  } = useGetAdditionalInformationByIdDpop({
    bucketProcessId: String(bucketIdDpop),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_BAST_DPOP,
  },
  {
    enabled: showSynfusionDpop,
  });

  /** Record VIEW activity when additional info loads */
  React.useEffect(() => {
    if (!isDetailLoading && !isDetailFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
        remarks: 'view additional information page',
      });
    }
  }, [isDetailLoading, isDetailFetching, processId, isProcessDpop, recordActivity]);

  /** Start Get current status from bucket */
  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.LPS,
    process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
  }
  );

  const { data: validateResult } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: debtorInfoData?.debtorId !== null && debtorInfoData?.debtorId !== undefined,
  });

  const submitEnable = validateResult?.content?.isSubmitButtonEnable;
  const isAdditionalInfoDone = stepper?.steps?.find((s: any) => s.key === 'additional-information')?.isDone;
  const isStepperComplete = stepper?.progress === 100;
  const currentStatus = debtorInfoData?.status;
  const isAskForInfo = stepper?.from?.includes('ASK_FOR_INFO');
  const isAskForInfoResponse = stepper?.from?.includes('RESPONSE');
  const isStatusCompleted = currentStatus === COMPLETED;
  const showEloStatus = currentStatus === REJECTED_FROM_ELO || currentStatus === WAITING_CIF;
  const isWaitingAskforInfo =
    currentStatus === WAITING_ASK_FOR_INFO_RESPONSE ||
    currentStatus === WAITING_ASK_FOR_INFO_APPROVAL_TL_RESPONSE ||
    currentStatus === WAITING_ASK_FOR_INFO_APPROVAL_KADIV_RESPONSE ||
    currentStatus === ASK_FOR_INFO_RESPONSE_RETURN_TO_STAFF ||
    currentStatus === ASK_FOR_INFO_RESPONSE_RETURN_TO_TL;

  /** End get current status from */

  const getSubmitBtnText = () => {
    if ((isMaker) || (isDivisiBisnis && (isRm || isTL))) {
      return 'Submit';
    } else if ((isChecker) || (isDivisiBisnis && !isRm && !isTL)) {
      return 'Approve';
    } else {
      return 'Confirm';
    }
  };

  const { mutate: submitBucket, isPending: isLoadingSubmit } = useSubmitBucket(
    {
      onError: (error: any) => {
        console.log('error', error);
        showNiceModalV2({ title: error?.message, type: 'error' });
      },
      onSuccess: (_, variables) => {
        console.log('variables', variables);
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});

        const isConfirmTitle = getSubmitBtnText() === 'Confirm' &&
          [actionButtons?.['SUBMIT'], 'SUBMIT'].includes(variables?.submitRequestDto?.action);
        if (variables?.submitRequestDto?.action === 'EDIT') {
          showNiceModalV2({
            title: '',
            type: 'success',
          });
          window.location.reload();
        } else {
          showNiceModalV2({
            onClose: () => handleBackToTable(),
            title: isConfirmTitle ? 'Permintaan terkirim. Menunggu konfirmasi sistem.' : 'Data berhasil dikirim',
            type: 'success',
          });
        }
      },
    }
  );

  const { isPending: isSaveLoading, mutate: doSaveAdditionalInformation } = useSaveAdditionalInformation({
    onError: (error: any) => showNiceModalV2({ title: error?.message, type: 'error' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['additional-info-bast-bisnis', { bucketProcessId: processId }]});
      // Reset dirty state
      setDirtyMsg(undefined);
      // Show modal
      showNiceModalV2({ onClose: () => goToNextStep(), title: 'Additional information berhasil disimpan', type: 'success' });
    },
  });


  const { isPending: isSaveLoadingDpop, mutate: saveAdditionalDpop } = useSaveAdditionalInformationDpop({
    onError: (error: any) => showNiceModalV2({ title: error?.message, type: 'error' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['additional-info-dpop', { bucketProcessId: processId }]});
      // Reset dirty state
      setDirtyMsg(undefined);
      // Show modal
      showNiceModalV2({ onClose: () => goToNextStep(), title: 'Additional information berhasil disimpan', type: 'success' });
    },
  });

  const { isPending: isLoadingElo, mutate: saveSendElo } = useSendToElo({
    onError: (error: any) => showNiceModalV2({ title: error?.message, type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => handleBackToTable(),
        title: 'Permintaan terkirim. Menunggu konfirmasi sistem.',
        type: 'success',
      });
    },
  });

  const modifiedObject = !viewOnly ? { SAVE: 'SAVE' } : { NEXT: 'NEXT' };
  let isEdit = false;
  for (const key in actionButtons) {
    if (key.includes('TABLE_UPLOAD_DOCUMENT_DELETE') || key.includes('TABLE_UPLOAD_DOCUMENT_EDIT') || key.includes('TABLE_UPLOAD_DOCUMENT_DOWNLOAD')) {

    } else if (key.includes('APPROVE_ASK_FOR_INFO')) {
      if (actionButtons['APPROVE_ASK_FOR_INFO_BUSINESS']) {
        modifiedObject['APPROVE_ASK_FOR_INFO_MODAL'] = 'APPROVE_ASK_FOR_INFO_MODAL';
      } else {
        modifiedObject['APPROVE_ASK_FOR_INFO'] = actionButtons['APPROVE_ASK_FOR_INFO'];
      }
    } else if (key.includes('ASK_FOR_INFO_TL') || key.includes('ASK_FOR_INFO_BUSINESS')) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('EDIT')) {
      isEdit = true;
    } else if (key.includes('SEND_TO_ELO')) {
      modifiedObject['SEND_TO_ELO'] = actionButtons[key];
    } else if (key.includes('RETURN_TO_MAKER')) {
      modifiedObject['RETURN_TO_MAKER'] = actionButtons[key];
    } else if (key.includes('ASK_FOR_INFO')) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else {
      modifiedObject[key] = actionButtons[key];
    }
  }


  const handleSaveAddInfoDpop = async (isSaveAndNext: boolean) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      const docxDpop = await convertToDocx(containerDpop);

      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_BAST_DPOP,
        remarks: isSaveAndNext ? 'save and next additional information DPOP' : 'save additional information DPOP',
      });

      if (isSaveAndNext) {
        saveAdditionalDpop({
          bucketProcessId: String(processId),
          description: docxDpop,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_BAST_DPOP,
        });
      } else {
        saveAdditionalDpop({
          bucketProcessId: String(processId),
          description: docxDpop,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_BAST_DPOP,
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            queryClient.invalidateQueries({ queryKey: ['additional-info-dpop', { bucketProcessId: processId }]});
            // Reset dirty state
            setDirtyMsg(undefined);
            // Show modal
            showNiceModalV2({ onClose: () => { }, title: 'Additional information berhasil disimpan', type: 'success' });
          },
        });
      }
    }
  };

  const handleBackToTable = () => {
    if (!isIconEdit) {
      return router.replace(loanProcessingSummary.BUCKET_LPS_BAST_PAGE);
    }
    return closeNiceModal(MODAL.GLOBAL.SUCCESS);
  };


  const handleEdit = () => {
    setIsIconEdit(true);
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.LPS,
            process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan diubah dengan Penerbitan yang baru, Apakah anda yakin?',
    });
  };


  const handleApprove = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        recordActivity({
          activity: ActivityType.APPROVE,
          bucketProcessId: processId,
          module: TypeModule.LPS,
          process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
          remarks: `approve additional information: action=${isTL ? radioValue : action}`,
        });
        submitBucket({
          submitRequestDto: {
            action: isTL ? radioValue : action,
            bucketProcessId: processId,
            ...(radioValue === 'BAST_DPOP' && { isCompleteEditAskForInfo: true }),
            comment,
            module: TypeModule.LPS,
            process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Foward To:',
      radioOptions: isTL && [
        { label: 'DPOP', value: 'BAST_DPOP' },
        {
          label: 'Kadiv',
          value: 'APPROVE',
        }
      ],
    });
  };

  const handleAskForInfo = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        recordActivity({
          activity: ActivityType.EDIT,
          bucketProcessId: processId,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_BAST_DPOP,
          remarks: `ask for info: action=${action}`,
        });
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_BAST_DPOP,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };


  const handleSaveAddInfoBisnis = async (isSaveAndNext: boolean) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      const docxBast = await convertToDocx(container);

      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_BAST,
        remarks: isSaveAndNext ? 'save and next additional information bisnis' : 'save additional information bisnis',
      });

      if (isSaveAndNext) {
        doSaveAdditionalInformation({
          bucketProcessId: String(processId),
          description: docxBast,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_BAST,
        });
      } else {
        doSaveAdditionalInformation({
          bucketProcessId: String(processId),
          description: docxBast,
          module: TypeModule.LPS,
          process: TypeProcess.LPS_BAST,
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            queryClient.invalidateQueries({ queryKey: ['additional-info-bast-bisnis', { bucketProcessId: processId }]});
            // Reset dirty state
            setDirtyMsg(undefined);
            // Show modal
            showNiceModalV2({ onClose: () => { }, title: 'Additional information berhasil disimpan', type: 'success' });
          },
        });
      }
    }
  };

  const handleForwardSubmit = (action: string) => {
    const forwardRole = isMaker
      ? { label: 'Checker', value: 'CHECKER' }
      : { label: isRm ? 'TL' : 'Kadiv', value: isRm ? 'TL' : 'KADIV' };

    const radioOptions = (isKadivBisnis || isChecker)
      ? undefined
      : [
        forwardRole,
        { label: 'DPOP', value: 'DPOP' },
      ];

    const getRadioValue = (radioValue: any) => (isKadivBisnis || isChecker) ? 'DPOP' : radioValue;

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          const submitRadioValue = getRadioValue(radioValue);

          const actionByRadioValue = {
            'CHECKER': SUBMIT,
            'DPOP': 'BAST_DPOP',
            'KADIV': SUBMIT,
            'TL': SUBMIT,
          };

          recordActivity({
            activity: ActivityType.SUBMIT,
            bucketProcessId: processId,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_BAST,
            remarks: 'forward submit additional information results',
          });

          submitBucket({
            submitRequestDto: {
              action: actionByRadioValue[submitRadioValue],
              bucketProcessId: processId,
              comment,
              ...(isAskForInfoResponse && { isCompleteEditAskForInfo: true }),
              module: TypeModule.LPS,
              process: TypeProcess.LPS_BAST,
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
        radioLabel: 'Forward To',
        radioOptions: radioOptions,
      }
    );
  };

  const handleSubmit = (action: string) => {
    if (!isAskForInfo && !isTLBisnis && !isKadivBisnis && !isDivisiDpop && !isDocumentSelected &&
      (action !== 'RETURN_TO_STAFF' && action !== 'RETURN_TO_TL' && action !== 'RETURN_TO_MAKER')) {
      showNiceModalV2({ title: 'Mohon pilih dokumen terlebih dahulu', type: 'warning' });
      return;
    }


    const hasRadioBtn = (isRm && isDivisiBisnis) || isMaker;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        recordActivity({
          activity: ActivityType.SUBMIT,
          bucketProcessId: processId,
          module: TypeModule.LPS,
          process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
          remarks: `submit additional information: action=${hasRadioBtn ? radioValue : action}`,
        });

        submitBucket({
          submitRequestDto: {
            action: hasRadioBtn ? radioValue : action,
            bucketProcessId: processId,
            ...(isWaitingAskforInfo && radioValue === 'BAST_DPOP' ? { isCompleteEditAskForInfo: true } : {}),
            comment,
            module: TypeModule.LPS,
            process: isProcessDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward To:',
      radioOptions: hasRadioBtn && [
        { label: 'DPOP', value: 'BAST_DPOP' },
        {
          label: isMaker ? 'Checker' : 'TL', value: 'SUBMIT',
        }
      ],
    });
  };

  const handleBastDone = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        recordActivity({
          activity: ActivityType.SUBMIT,
          bucketProcessId: processId,
          module: TypeModule.LPS,
          process,
          remarks: `BAST Done: action=${action}`,
        });
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.LPS,
            process,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSendToElo = () => {
    recordActivity({
      activity: ActivityType.SUBMIT,
      bucketProcessId: processId,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
      remarks: 'send to ELO',
    });
    saveSendElo({
      bucketProcessId: String(processId),
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
    });
  };


  // Auto-save payload for Bisnis
  const autoSavePayloadBisnis = useMemo(() => async () => {
    if (!container) {
      return Promise.resolve(null);
    }

    const docxBast = await convertToDocx(container);
    const payload = {
      bucketProcessId: String(processId),
      description: docxBast,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
    };

    return Promise.resolve(payload);
  }, [container, processId]);

  // Auto-save payload for DPOP
  const autoSavePayloadDpop = useMemo(() => async () => {
    if (!containerDpop) {
      return Promise.resolve(null);
    }

    const docxDpop = await convertToDocx(containerDpop);
    const payload = {
      bucketProcessId: String(processId),
      description: docxDpop,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST_DPOP,
    };

    return Promise.resolve(payload);
  }, [containerDpop, processId]);

  // Auto-save hook for Bisnis
  const { isFetching: isAutoSaveFetchingBisnis } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly &&
      !!container &&
      !!processId &&
      !isProcessDpop,
    payload: autoSavePayloadBisnis,
    url: 'agreement.additional.saveBisnis',
  });

  // Auto-save hook for DPOP
  const { isFetching: isAutoSaveFetchingDpop } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly &&
      !!containerDpop &&
      !!processId,
    payload: autoSavePayloadDpop,
    url: 'agreement.additional.saveDpop',
  });


  const sortArray = () => {
    let arr: string[] = [];
    if (showEloStatus) {
      arr = [
        'NEXT',
        'SEND_TO_ELO',
      ];
    } else if ((isMaker) || (isRm && isDivisiBisnis && !isStatusCompleted)) {
      arr = [
        'BAST_DONE',
        'ASK_FOR_INFO',
        'NEXT',
        'SAVE',
        'FORWARD_SUBMIT',
        'SUBMIT',
      ];
    } else if (!isDivisiBisnis) {
      arr = [
        'NEXT',
        'SAVE',
        'RETURN_TO_MAKER',
        'APPROVE',
        'ASK_FOR_INFO',
        'SUBMIT',
      ];
    } else {
      arr = [
        'NEXT',
        'SAVE',
        'RETURN_TO_STAFF',
        'RETURN_TO_TL',
        'RETURN_TO_MAKER',
        'APPROVE',
        'FORWARD_SUBMIT',
        'SUBMIT',
      ];
    }
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
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            Return to Staff
          </Button>
        );
      case RETURN_TO_TL:
        return (
          <Button
            color="info"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            Return to TL
          </Button>
        );
      case RETURN_TO_MAKER:
        return (
          <Button
            color="info"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            Return to Maker
          </Button>
        );
      case SUBMIT:
        return (
          <Button
            color="success"
            disabled={isLoadingSubmit || !submitEnable || !isStepperComplete || !isAdditionalInfoDone}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            {getSubmitBtnText()}
          </Button>
        );
      case 'FORWARD_SUBMIT':
        return (
          <Button
            color="success"
            disabled={isLoadingSubmit || !submitEnable || !isStepperComplete || !isAdditionalInfoDone}
            isLoading={isLoadingSubmit}
            onClick={() => handleForwardSubmit(value)}
          >
            {(isKadivBisnis || isChecker) ? 'Approve' : 'Submit'}
          </Button>
        );
      case BAST_DONE:
        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#F5954F',
            }}
            onClick={() => handleBastDone(value)}
            disabled={isLoadingSubmit || !submitEnable}
            isLoading={isLoadingSubmit}
          >
            BAST Done
          </Button>
        );
      case 'SAVE':
        return (
          <>
            {!viewOnly && (
              <Button
                isLoading={isSaveLoading || isSaveLoadingDpop}
                disabled={isAutoSaveFetchingBisnis || isAutoSaveFetchingDpop}
                onClick={!isProcessDpop
                  ? () => handleSaveAddInfoBisnis(false)
                  : () => handleSaveAddInfoDpop(false)
                }
              >
                {(isAutoSaveFetchingBisnis || isAutoSaveFetchingDpop) ? 'Auto Save ...' : 'Save'}
              </Button>
            )}
            <Button
              isLoading={isSaveLoading || isSaveLoadingDpop}
              onClick={!isProcessDpop
                ? () => handleSaveAddInfoBisnis(true)
                : () => handleSaveAddInfoDpop(true)
              }
            >
              Next
            </Button>
          </>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleApprove(value)}
            variant="contained"
            color="success"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
          >
            Approve
          </Button>
        );
      case 'ASK_FOR_INFO':
        return (
          <Button
            onClick={() => handleAskForInfo(value)}
            variant="contained"
            color="warning"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
          >
            Ask for info
          </Button>
        );
      case 'SEND_TO_ELO':
        return (
          <Button
            onClick={handleSendToElo}
            color="success"
            isLoading={isLoadingElo}
            disabled={isLoadingElo}
          >
            Send To ELO
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => goToNextStep()}
          >
            Next
          </Button>
        );
    }
  };

  return {
    additionalInformationBusiness,
    additionalInformationDpop,
    container,
    containerDpop,
    handleButton,
    handleEdit,
    isAddInfoDpopFetching,
    isAddInfoDpopLoading,
    isAskForInfo,
    isDetailLoading,
    isDivisiBisnis,
    isDivisiDpop,
    isEdit,
    isProcessDpop,
    isRm,
    isSaveLoading,
    isSuperAdmin,
    setContainer,
    setContainerDpop,
    showSynfusionDpop,
    sortedObject,
    viewOnly,
  };
};

export default useAdditionalInformation;
