/* eslint-disable max-len */
'use client';
import { useContext, useEffect, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import {
  roles,
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckSubmitAskForInfo from '@/hooks/services/useCheckSubmitAskForInfo';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import { modal, STATUS_SPFP } from './ComplianceCheck.constants';
import useCheckEnableAskForInfo from './hooks/useCheckEnableAskForInfo';
import useDeleteComplianceCheck from './hooks/useDeleteComplianceCheck';
import useGetDetailComplianceCheck from './hooks/useGetDetailComplianceCheck';
import useSaveComplianceCheck from './hooks/useSaveComplianceCheck';
import useSaveWordComplianceCheck from './hooks/useSaveWordComplianceCheck';
import useSubmitComplianceCheck from './hooks/useSubmitComplianceCheck';

import type { ComplianceResponseDto } from '@/services/openapi/agreement-service';


const schema =
  object({
    description: string(),
    disclaimer: string(),
    isComply: string().required(),
  });

export const useComplianceCheck = (props) => {
  const { processId } = useIdentity();
  const bucket = useSpfpBucketContext();
  const { goToNextStep } = useSpfpContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const stepper = state?.stepper;
  const currentRole = state?.currentRole;
  const isRm = currentRole?.includes(roles.RM);
  const isTl = currentRole?.includes(roles.TL);
  const isKadiv = currentRole?.includes(roles.KADIV);
  const isMaker = currentRole?.includes(roles.MAKER);
  const isChecker = currentRole?.includes(roles.CHECKER);

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION
  ];

  const isBusiness = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabReview, setActiveTabReview] = useState(0);
  const shouldGoNextRef = useRef(false);
  let actions = [];
  const {
    handleSubmit: handleSubmitForm,
    control,
    reset,
    formState: { isValid, isSubmitted, isDirty, errors },
    watch,
    getValues,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const path = usePathname();
  const pathName = path.split('/');
  const isComplianceCheck = pathName[pathName.length - 1] === 'compliance-check';

  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  if (actions) {
    for (const key in actions) {
      if (key.includes('ASK_FOR_INFO')) {
        buttons['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
      } else if (key.includes('EDIT')) {
        // isEdit = true;
      } else {
        buttons[key] = actions[key];
      }
    }
  }

  // Check if only SAVE action is available (to show Next button)
  const isActionOnlySave = actions && Object.keys(actions).length === 1 && actions['SAVE'];

  const [formData, setFormData] = useState({
    description: '',
    disclaimer: '',
    isComply: '',
  });
  const [data, setData] = useState<ComplianceResponseDto[]>([]);
  const [complianceNumber, setComplianceNumber] = useState(null);

  const {
    data: bucketDetail,
  } = useGetBucketById({ ...bucket });

  const { data: dataDetail, isFetching: isLoading, refetch } = useGetDetailComplianceCheck({
    ...bucket,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!!dataDetail && !isLoading) {
      if (!isDirty) {
        const complyData = dataDetail.comply;
        let isComplyValue = '';
        if (complyData === true) {
          isComplyValue = 'COMPLY';
        } else if (complyData === false) {
          isComplyValue = 'NOT_COMPLY';
        }
        setFormData({
          description: dataDetail.description,
          disclaimer: dataDetail.disclaimer,
          isComply: isComplyValue,
        });
        reset({
          'description': dataDetail.description,
          'disclaimer': dataDetail.disclaimer,
          'isComply': isComplyValue,
        });
      }
      setData(dataDetail.complianceChild);
      setComplianceNumber(dataDetail.complianceNumber);
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view compliance check detail for bucket: ${bucket?.bucketProcessId}`,
      });
    }
  }, [dataDetail, isLoading, bucket, recordActivity]);

  useEffect(() => {
    if (isSubmitted) {
      // Reset dirty message on form submit
      setDirtyMsg(undefined);
    } else {
      if (isDirty && JSON.stringify(watch()) !== JSON.stringify(formData)) {
        setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      } else {
        setDirtyMsg(undefined);
      }
    }
  }, [isSubmitted, watch(), formData]);

  useEffect(() => {
    const tab = searchParams?.get('tab');

    if (tab === 'dpop') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  const handleChangeTab = (val: number) => {
    if (val === 0) {
      router.push(`${pathname}`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=dpop`);
    }
    refetch();
  };

  const handleChangeTabReview = (val: number) => {
    setActiveTabReview(val);
    refetch();
  };

  const { data: checkEnableAskForInfo } = useCheckEnableAskForInfo({
    bucketProcessId: bucket?.bucketProcessId || '',
    module: bucket?.module || '',
    process: bucket?.process || '',
  });

  const { data: checkSubmitAskForInfo } = useCheckSubmitAskForInfo({
    bucketProcessId: bucket?.bucketProcessId || '',
  });

  const isEnableAskForInfo = checkEnableAskForInfo === true;
  const isEnableSubmitAskForInfo = checkSubmitAskForInfo === true;

  const { mutate: deleteComplianceCheck } = useDeleteComplianceCheck({
    onError: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to delete compliance check for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        title: 'Data berhasil dihapus',
      });
    },
  });

  const handleDeleteComplianceCheck = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: row.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: row.module || '',
      process: row.process || '',
      remarks: `open delete confirmation modal for compliance check: ${row.complianceNumber}`,
    });
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        recordActivity({
          activity: ActivityType.CANCEL,
          bucketProcessId: row.bucketProcessId || '',
          changeAfter: '',
          changeBefore: '',
          module: row.module || '',
          process: row.process || '',
          remarks: `cancel delete compliance check: ${row.complianceNumber}`,
        });
      },
      onSubmit: () => {
        const deleteData = {
          bucketProcessId: row.bucketProcessId,
          complianceNumber: row.complianceNumber,
          module: row.module,
          process: row.process,
        };
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: row.bucketProcessId || '',
          changeAfter: '',
          changeBefore: JSON.stringify(row),
          module: row.module || '',
          process: row.process || '',
          remarks: `confirm delete compliance check: ${row.complianceNumber}`,
        });
        deleteComplianceCheck(deleteData);
        // Record success after delete
        setTimeout(() => {
          recordActivity({
            activity: ActivityType.DELETE,
            bucketProcessId: row.bucketProcessId || '',
            changeAfter: '',
            changeBefore: JSON.stringify(deleteData),
            module: row.module || '',
            process: row.process || '',
            remarks: `successfully deleted compliance check: ${row.complianceNumber}`,
          });
        }, 100);
      },
      title: 'Apakah anda yakin untuk menghapus data Compliance Check?',
    });
  };

  const { isPending: isSaveLoading, mutate: save } = useSaveComplianceCheck({
    onError: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: JSON.stringify(formData),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to save compliance check for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(formData),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `successfully saved compliance check for bucket: ${bucket?.bucketProcessId}`,
      });
      // Reset dirty state
      setDirtyMsg(undefined);
      closeNiceModal(modal.MODAL_ADD_PERIHAL);

      // Show modal
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });

      // Navigate to next step if shouldGoNextRef is true
      if (shouldGoNextRef.current) {
        shouldGoNextRef.current = false;
        goToNextStep();
      }
      refetch();
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitComplianceCheck({
  });

  const onSuccess = () => {
    showNiceModalV2({
      onClose: () => {
        switch (pathName[3]) {
          case 'bucket':
            return router.push(spfp.LIST_PAGE_MODULE.replace('[module]', pathName[3]));
          case 'assignment':
            return router.push(spfp.ASSIGNMENT_PAGE);
          case 'monitoring':
            return router.push(spfp.MONITORING_PAGE);
          default:
            return router.push(spfp.LIST_PAGE_MODULE.replace('[module]', pathName[3]));
        }
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };
  const handleForwardToDpop = () => {
    const firstOption = isRm
      ? { label: 'TL', value: 'SUBMIT' }
      : { label: isMaker ? 'Checker' : 'Kadiv', value: 'APPROVE' };

    const radioOptions = (isKadiv || isChecker)
      ? undefined
      : [firstOption, { label: 'DPOP', value: 'FORWARD_TO_DPOP' }];

    const getRadioValue = (radioValue: any) => (isKadiv || isChecker ? 'DPOP' : radioValue);

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        const submitRadioValue = getRadioValue(radioValue);
        const actionByRadioValue = {
          'APPROVE': SUBMIT,
          'DPOP': 'FORWARD_TO_DPOP',
          'FORWARD_TO_DPOP': 'FORWARD_TO_DPOP',
          'SUBMIT': SUBMIT,
        };

        const isKadivEdited = stepper?.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_KADIV_EDITED;

        const submitData = {
          action: actionByRadioValue[submitRadioValue],
          comment,
          ...(isKadivEdited && { isCompleteEditAskForInfo: true }),
          ...bucket,
        };

        recordActivity({
          activity: ActivityType.SUBMIT,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: JSON.stringify(submitData),
          changeBefore: JSON.stringify({ ...bucket, currentAction: 'before forward submit' }),
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `forward submit compliance check with action: ${actionByRadioValue[submitRadioValue]} for bucket: ${bucket?.bucketProcessId}`,
        });

        closeNiceModal(MODAL.GLOBAL.COMMENT);

        submitBucket(submitData, {
          onError: (err) => {
            showNiceModalV2({
              title: 'Terjadi kesalahan, Mohon di coba kembali',
              type: 'error',
            });
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
            onSuccess();
          },
        });
      },
      radioLabel: 'Forward To',
      radioOptions: radioOptions,
    });
  };

  const handleSubmit = (
    { action, showComment = true }: { action: string; showComment?: boolean }
  ) => {
    if (showComment) {
      if (action === 'SUBMIT') {
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment }) => {
              const submitData = {
                action,
                comment,
                ...bucket,
              };
              const kadivApproveAskForInfo = {
                action,
                comment,
                isCompleteEditAskForInfo: true,
                ...bucket,
              };
              recordActivity({
                activity: ActivityType.SUBMIT,
                bucketProcessId: bucket?.bucketProcessId || '',
                changeAfter: JSON.stringify(submitData),
                changeBefore: JSON.stringify({ ...bucket, currentAction: 'before submit' }),
                module: bucket?.module || '',
                process: bucket?.process || '',
                remarks: `submit compliance check with action: ${action} for bucket: ${bucket?.bucketProcessId}`,
              });
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              if (stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_KADIV || stepper.from === STATUS_SPFP.SPFP_REVISION_ASK_FOR_INFO_WAITING_KADIV
                || stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_KADIV_EDITED) {
                submitBucket(kadivApproveAskForInfo, {
                  onError: (err) => {
                    showNiceModalV2({
                      title: 'Terjadi kesalahan, Mohon di coba kembali',
                      type: 'error',
                    });
                  },
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                    queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
                    onSuccess();
                  },
                });
              } else {
                submitBucket(submitData, {
                  onError: (err) => {
                    showNiceModalV2({
                      title: 'Terjadi kesalahan, Mohon di coba kembali',
                      type: 'error',
                    });
                  },
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                    queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
                    onSuccess();
                  },
                });
              }
            },
          }
        );
      } else if (action === 'CANCEL') {
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              const bucketAction = radioValue === '1' || radioValue === 1 ? 'CANCEL' : 'REJECT';
              const submitData = {
                action: bucketAction,
                comment,
                ...bucket,
              };
              recordActivity({
                activity: ActivityType.SUBMIT,
                bucketProcessId: bucket?.bucketProcessId || '',
                changeAfter: JSON.stringify(submitData),
                changeBefore: JSON.stringify({ ...bucket, currentAction: 'before cancel/reject' }),
                module: bucket?.module || '',
                process: bucket?.process || '',
                remarks: `submit compliance check with action: ${bucketAction} for bucket: ${bucket?.bucketProcessId}`,
              });
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              submitBucket(submitData, {
                onError: () => {
                  showNiceModalV2({
                    title: 'Terjadi kesalahan, Mohon di coba kembali',
                    type: 'error',
                  });
                },
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                  queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
                  onSuccess();
                },
              });
            },
            radioLabel: 'Declined',
            radioOptions: [
              { label: 'Canceled', value: '1' },
              { label: 'Rejected', value: '2' }
            ],
          },
        );
      } else {
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
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
                remarks: `submit compliance check with action: ${action} for bucket: ${bucket?.bucketProcessId}`,
              });
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              submitBucket(submitData, {
                onError: (err) => {
                  const errMessage = action === 'FINAL' ? err['response'].data.errorDetail : 'Terjadi kesalahan, Mohon di coba kembali';
                  showNiceModalV2({ title: errMessage, type: 'error' });
                },
                onSuccess: (res) => {
                  queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                  queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
                  if (res.data !== 'OK') {
                    showNiceModalV2({
                      onClose: () => {
                        router.push(spfp.LIST_PAGE_MODULE.replace('[module]', pathName[3]));;
                      },
                      title: res.data,
                      type: 'success',
                    });
                  } else {
                    onSuccess();
                  }
                },
              });
            },
          },
        );
      }
    } else {
      const submitData = {
        action,
        comment: action,
        ...bucket,
      };
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: JSON.stringify(submitData),
        changeBefore: JSON.stringify({ ...bucket, currentAction: 'before submit' }),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `submit compliance check with action: ${action} (no comment) for bucket: ${bucket?.bucketProcessId}`,
      });
      submitBucket(submitData, {
        onError: () => {
          showNiceModalV2({
            title: 'Terjadi kesalahan, Mohon di coba kembali',
            type: 'error',
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
          queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
          onSuccess();
        },
      });
    }
  };

  const handleOnSave = (formData?: any, goNext: boolean = false) => {
    shouldGoNextRef.current = goNext;

    // Use formData if provided (from handleSubmitForm), otherwise use getValues
    const data = formData || getValues();
    const savePayload = {
      complianceNumber: !!complianceNumber ? complianceNumber : null,
      description: data.description,
      disclaimer: data.disclaimer,
      isComply: data.isComply === 'COMPLY' ? true : false,
      ...bucket,
    };

    // Record activity before save
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: JSON.stringify(savePayload),
      changeBefore: JSON.stringify(formData),
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `initiate save compliance check for bucket: ${bucket?.bucketProcessId}`,
    });

    // If formData is provided, form is valid, so save directly
    // If formData is not provided, check if form is valid
    if (formData) {
      // Form valid, save directly
      save(savePayload);
    } else if (!isValid) {
      // Form not valid, show warning modal
      showNiceModalV2({
        onSubmit() {
          save(savePayload);
        },
        title: 'Data mandatory belum terisi, apakah anda yakin ingin melanjutkan?',
        type: 'warning',
      });
    } else {
      // Form valid but no formData provided (direct call), save directly
      save(savePayload);
    }
  };

  // Wrapper untuk handleSubmitForm yang selalu memanggil handleOnSave
  const handleSaveWithValidation = handleSubmitForm(
    (formData) => {
      // Form valid, langsung save
      handleOnSave(formData);
    },
    () => {
      // Form tidak valid, tetap panggil handleOnSave untuk menampilkan warning
      handleOnSave();
    }
  );

  const { isPending: isSaveWordLoading, mutate: saveWord } = useSaveWordComplianceCheck({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      refetch();
    },
  });

  const handleSaveWord = (payload: { responseFile?: Blob; reviewFile?: Blob }) => {
    if (!complianceNumber) {
      showNiceModalV2({
        title: 'Compliance number tidak ditemukan',
        type: 'error',
      });
      return;
    }

    saveWord({
      bucketProcessId: bucket.bucketProcessId,
      complianceNumber: complianceNumber,
      module: bucket.module,
      process: bucket.process,
      ...payload,
    });
  };

  const handleAddPerihal = async () => {
    NiceModal.show(modal.MODAL_ADD_PERIHAL, {
      bucketProcessId: bucket.bucketProcessId,
      module: bucket.module,
      process: bucket.process,
    });
  };

  const handleSubmitAskForInfo = ({ action, comment, isCompleteEditAskForInfo }: { action: string; comment: string; isCompleteEditAskForInfo?: boolean }) => {
    submitBucket({
      action,
      comment,
      ...(isCompleteEditAskForInfo && { isCompleteEditAskForInfo: true }),
      ...bucket,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        queryClient.invalidateQueries({ queryKey: ['bucket-child-list']});
        onSuccess();
      },
    });
  };

  const methods = {
    control,
    getValues,
    reset,
    watch,
  };

  return {
    activeTab,
    activeTabReview,
    bucketDetail,
    buttons,
    control,
    data,
    errors,
    handleAddPerihal,
    handleChangeTab,
    handleChangeTabReview,
    handleDeleteComplianceCheck,
    handleForwardToDpop,
    handleOnSave,
    handleSaveWithValidation,
    handleSaveWord,
    handleSubmit,
    handleSubmitAskForInfo,
    handleSubmitForm,
    isActionOnlySave,
    isBusiness,
    isChecker,
    isComplianceCheck,
    isDirty,
    isEnableAskForInfo,
    isEnableSubmitAskForInfo,
    isKadiv,
    isLoading: isLoading,
    isMaker,
    isRm,
    isSaveLoading,
    isSaveWordLoading,
    isSubmitLoading,
    isTl,
    isValid,
    methods,
    verificationSheetData: (dataDetail as any) || null,
  };
};
