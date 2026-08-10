'use client';
import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  DPOP_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  roles,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import useGetBucketDetail from '@/components/pages/MaintenanceData/MaintenanceDebtor/hooks/useGetBucketDetail';

import { action } from '../VerificationSheetPage/VerificationSheet.constants';

import useDeleteOfferingLetter from './hooks/useDeleteOfferingLetter';
import useGetDetailBocDecision from './hooks/useGetDetailBocDecision';
import useGetListOffringLetter from './hooks/useGetListOfferingLetter';
import useSaveBocDecision from './hooks/useSaveBocDecision';
import useSubmitSpfp from './hooks/useSubmitSpfp';
import { modal } from './UploadOfferingLetter.constants';


export const useUploadOfferingLetter = (props, formValues?: any) => {
  const { processId } = useIdentity();
  const bucket = useSpfpBucketContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { goToNextStep } = useSpfpContext();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const pathList = spfp.LIST_PAGE;
  const path = usePathname();
  const [state] = useApp();
  const userData = state?.userData;
  const currentRole = state?.currentRole;
  const { divisionCode } = useDivision();
  const stepper = state?.stepper;

  const isMaker = currentRole?.includes(roles.MAKER);
  const isChecker = currentRole?.includes(roles.CHECKER);
  const isKadiv = currentRole?.includes(roles.KADIV);
  const isTl = currentRole?.includes(roles.TL);
  const isSuperAdmin = isMaker || isChecker;
  const isRm = currentRole?.includes(roles.RM);

  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);
  const isDivisiDpop = divisionCode.includes(DPOP_DIVISION);

  useEffect(() => {
    if (bucket?.bucketProcessId) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view upload offering letter page for bucket: ${bucket?.bucketProcessId}`,
      });
    }
  }, [bucket, recordActivity]);

  let actions = [];
  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  let isEdit = false;
  if (!!actions) {
    Object.keys(actions).forEach((key) => {
      buttons[key] = actions[key];
      if (key === 'EDIT') {
        isEdit = true;
      }
    });
  }

  const { data: offeringLetterData, isLoading: offeringLetterLoading } = useGetListOffringLetter({
    ...bucket,
  });

  const { data: bocDecisionData, isLoading: bocDecisionLoading } = useGetDetailBocDecision({
    ...bucket,
  });

  // Get bucket detail to access relatedProcess for SPFP redirect
  const { data: bucketDetailData } = useGetBucketDetail({
    ...bucket,
  });

  // Extract SPFP process ID from relatedProcess array
  const spfpProcessId = (bucketDetailData as any)?.data?.content?.relatedProcess?.find(
    (process: string) => process?.startsWith('SPFP')
  );

  const { mutate: submitSpfp, isPending: isSubmitLoading } = useSubmitSpfp({
    onError: () => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to submit SPFP for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
  });

  const onSuccess = () => {
    showNiceModalV2({
      onClose: () => {
        router.push(pathList);
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };

  const onSuccessRevision = (actionType?: string) => {
    showNiceModalV2({
      onClose: () => {
        if (spfpProcessId && actionType === action.REVISION) {
          router.push(`/loan-processing/spfp/bucket/${spfpProcessId}/upload-offering-letter`);
        } else {
          router.push(pathList);
        }
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };

  const onSuccessReload = () => {
    showNiceModalV2({
      onClose: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        router.refresh();
        window.location.reload();
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };

  const { isPending: isSaveLoading, mutate: saveBocDecision } = useSaveBocDecision({
    onError: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: JSON.stringify(bocDecisionData),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to save BOC decision for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Note: changeAfter akan diisi di handleSaveAndNext sebelum save dipanggil
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: JSON.stringify(bocDecisionData || {}),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `successfully saved BOC decision for bucket: ${bucket?.bucketProcessId}`,
      });
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({
        onClose: () => {
          if (shouldGoNext) {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: bucket?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: bucket?.module || '',
              process: bucket?.process || '',
              remarks: `navigate to next step after saving BOC decision for bucket: ${bucket?.bucketProcessId}`,
            });
            goToNextStep();
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: deleteOfferingLetter } = useDeleteOfferingLetter({
    onError: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to delete offering letter for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: bucket?.bucketProcessId,
        module: bucket?.module,
        process: bucket?.process,
        remarks: `successfully deleted offering letter for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    if (!formValues || !bucket?.bucketProcessId) {
      return Promise.resolve(null);
    }

    const payload = {
      bocDate: formValues?.bocDate,
      bucketProcessId: bucket?.bucketProcessId,
      description: formValues?.description,
      module: bucket?.module,
      process: bucket?.process,
    };

    return Promise.resolve(payload);
  }, [formValues, bucket]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'agreement.add.saveBoc',
  });

  const handleOpenAddModal = async () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open upload document modal for bucket: ${bucket?.bucketProcessId}`,
    });
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, props);
  };

  const handleAddOL = async () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open add offering letter modal for bucket: ${bucket?.bucketProcessId}`,
    });
    NiceModal.show(modal.MODAL_ADD_OL, {
      bucketProcessId: bucket.bucketProcessId,
      module: bucket.module,
      process: bucket.process,
    });
  };

  const handleDeleteData = (noDraft: string) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open delete confirmation modal for offering letter: ${noDraft}`,
    });
    showNiceModalV2({
      cancelText: 'Tidak',
      onCancel: () => {
        recordActivity({
          activity: ActivityType.CANCEL,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: '',
          changeBefore: '',
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `cancel delete offering letter: ${noDraft}`,
        });
      },
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: '',
          changeBefore: JSON.stringify({ id: noDraft }),
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `confirm delete offering letter: ${noDraft}`,
        });
        deleteOfferingLetter({ id: noDraft });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data? ',
      type: 'warning',
    });

  };

  const handleSaveAndNext = async (data: any) => {
    if (viewOnly) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `navigate to next step from upload offering letter (view only) for bucket: ${bucket?.bucketProcessId}`,
      });
      goToNextStep();
    } else {
      const payload = {
        bocDate: data?.bocDate,
        description: data?.description,
        ...bucket,
      };
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: JSON.stringify(payload),
        changeBefore: JSON.stringify(bocDecisionData || {}),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `initiate save BOC decision for bucket: ${bucket?.bucketProcessId}`,
      });
      saveBocDecision(payload);
    }
  };

  const handleOpenSubmitModal = ({ action }: { action: any }) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open submit modal for action: ${action} (bucket: ${bucket?.bucketProcessId})`,
    });
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const submitData = {
          action,
          comment,
          ...bucket,
        };
        recordActivity({
          activity: ActivityType.SUBMIT,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: JSON.stringify(submitData),
          changeBefore: JSON.stringify({ ...bucket, currentAction: 'before submit' }),
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `submit SPFP with action: ${action} for bucket: ${bucket?.bucketProcessId}`,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        submitSpfp({
          submitRequestDto: {
            action,
            comment,
            ...bucket,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list', { ...bucket }]});
            if (stepper?.from === 'SPFP_CREATION_FINAL' && action !== 'REVISION') {
              onSuccessReload();
            } else {
              onSuccessRevision(action);
            }
          },
        });
      },
    });
  };

  const handleOpenSubmitWarningModal = ({ action }: { action: any }) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open submit confirmation for action: ${action} (bucket: ${bucket?.bucketProcessId})`,
    });

    const needsConfirmation = bucket?.process === TypeProcess.SPFP_FINAL && stepper?.from !== 'SPFP_FINAL';

    const openCommentModal = () => {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          const submitData = {
            action,
            comment,
            ...bucket,
          };
          recordActivity({
            activity: ActivityType.SUBMIT,
            bucketProcessId: bucket?.bucketProcessId || '',
            changeAfter: JSON.stringify(submitData),
            changeBefore: JSON.stringify({ ...bucket, currentAction: 'before submit' }),
            module: bucket?.module || '',
            process: bucket?.process || '',
            remarks: `submit SPFP with action: ${action} for bucket: ${bucket?.bucketProcessId}`,
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          submitSpfp({
            submitRequestDto: {
              action,
              comment,
              ...bucket,
            },
          }, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list', { ...bucket }]});
              if (stepper?.from === 'SPFP_CREATION_FINAL') {
                onSuccessReload();
              } else {
                onSuccess();
              }
            },
          });
        },
      });
    };

    if (needsConfirmation) {
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText: 'Ya',
        cancelText: 'Close',
        onCancel: () => {
          recordActivity({
            activity: ActivityType.CANCEL,
            bucketProcessId: bucket?.bucketProcessId || '',
            changeAfter: '',
            changeBefore: '',
            module: bucket?.module || '',
            process: bucket?.process || '',
            remarks: `cancel submit confirmation for action: ${action} (bucket: ${bucket?.bucketProcessId})`,
          });
          closeNiceModal(MODAL.GLOBAL.CONFIRM);
        },
        onSubmit: () => {
          closeNiceModal(MODAL.GLOBAL.CONFIRM);
          openCommentModal();
        },
        title: 'Apakah anda yakin final OL sudah ditandatangani?',
      });
    } else {
      openCommentModal();
    }
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          setDirtyMsg(undefined);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            action: radioValue,
            comment,
            ...bucket,
          };

          submitSpfp({ submitRequestDto: payload }, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list', { ...bucket }]});
              onSuccess();
            },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: action.CANCELED },
          { label: 'Rejected', value: action.REJECTED }
        ],
      },
    );
  };

  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        submitSpfp({
          submitRequestDto: {
            action: 'SPFP_ASK_FOR_INFO_EDITED',
            bucketProcessId: bucket?.bucketProcessId,
            module: bucket?.module,
            process: bucket?.process,
          },
        }, {
          onSuccess: () => {
            window.location.reload();
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan diubah dengan Penerbitan yang baru, Apakah anda yakin?',
    });
  };

  return {
    bocDecisionData,
    buttons,
    handleAddOL,
    handleDecline,
    handleDeleteData,
    handleEdit,
    handleOpenAddModal,
    handleOpenSubmitModal,
    handleOpenSubmitWarningModal,
    handleSaveAndNext,
    isAutoSaveFetching,
    isChecker,
    isDivisiBisnis,
    isDivisiDpop,
    isEdit,
    isKadiv,
    isMaker,
    isRm,
    isSaveLoading,
    isSubmitLoading,
    isSuperAdmin,
    isTl,
    offeringLetterData,
    offeringLetterLoading,
    setShouldGoNext,
  };
};
