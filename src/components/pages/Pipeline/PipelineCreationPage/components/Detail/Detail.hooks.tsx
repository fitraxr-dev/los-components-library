import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { keepPreviousData } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { annualReview, fastTrack, mip, pipeline } from '@/configs/constants/pathname';
import { PIPELINE_STATUS } from '@/configs/constants/pipeline';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useSaveHistory from '@/hooks/services/useSaveHistory';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetGroupList from '@/components/pages/Pipeline/GroupPage/hooks/useGetGroupList';
import Button from '@/components/shared/Button';
import useDeleteFinancingFacility from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useDeleteFinancingFacility';
import useGetFinancingFacilityByPipelineId from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useGetFinancingFacilityByPipelineId';

import useCheckFinancingFacilityExist from '../../hooks/useCheckFinancingFacilityExist';
import useGetPipelineById from '../../hooks/useGetPipelineById';
import useSavePipeline from '../../hooks/useSavePipeline';
import useSubmitPipeline from '../../hooks/useSubmitPipeline';
import FormDebtor from '../FormDebtor';
import PipelineDataViewOnly from '../PipelineDataViewOnly';

import {
  DISABLED_FIELDS,
  DISABLED_FIELDS_EXISTING,
  MANDATORY_FIELDS,
  MANDATORY_FIELDS_EXISTING,
  VALIDATION_SCHEMA,
} from './Detail.constants';

import type {
  NotificationFormValues,
  NotificationRecipients,
} from '../ModalNotificationFastTrack/ModalNotificationFastTrack.types';
import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const useDetail = () => {
  const [formPipelineData, setFormPipelineData] = useState(null);

  const [state] = useApp();
  const path = usePathname();
  const router = useCustomRouter();
  const { debtorId, setDebtorId, processId, setDebtorName } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const { stepper, currentRole } = state;
  const isRM = currentRole.includes(roles.RM);
  const isSuperAdminMaker = currentRole.includes(roles.MAKER);

  const actionButtons = stepper?.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;
  const sortArray = ['COMMENT', 'DECLINE', 'SAVE', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER', 'SUBMIT', 'CLOSE', 'GO_TO_MIP', 'GO_TO_ANNUAL_REVIEW', 'GO_TO_FAST_TRACK'];

  const { data: validateResult } = useGetValidateResult({
    debtorId,
  }, {
    enabled: debtorId !== null,
  });


  const isProgessCompleted = useMemo(() => {
    return stepper.progress === 100;
  }, [stepper]);

  const {
    data: pipelineDetail,
    isSuccess: isGetDetailSuccess,
    isLoading,
  } = useGetPipelineById({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  });

  const { data, isSuccess: isGetDebtorSuccess } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeModule.PIPELINE,
  });

  const { data: groupData } = useGetGroupList({
    bucketProcessId: processId,
    debtorId,
    module: TypeModule.PIPELINE,
    name: '',
    process: TypeProcess.PIPELINE,
  });

  const { data: facilityListData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
  });

  const modifiedObject = useMemo(() => {
    let actionObject: any = {};

    if (viewOnly) {
      actionObject = { CLOSE: 'CLOSE' };
    }

    for (const key in actionButtons) {
      if (key.includes('CANCEL') || key.includes('REJECT')) {
        actionObject['DECLINE'] = 'DECLINE';
      } else if (key === 'GO_TO_MIP') {
        const typeProcess = pipelineDetail?.typeProcess;
        if (typeProcess === TypeProcess.FAST_TRACK) {
          actionObject['GO_TO_FAST_TRACK'] = 'GO_TO_FAST_TRACK';
        } else if (typeProcess === TypeProcess.ANNUAL_REVIEW) {
          actionObject['GO_TO_ANNUAL_REVIEW'] = 'SUBMIT_TO_ANNUAL_REVIEW';
        } else {
          actionObject['GO_TO_MIP'] = actionButtons[key];
        }
      } else {
        actionObject[key] = actionButtons[key];
      }
    }

    return actionObject;
  }, [viewOnly, actionButtons, pipelineDetail]);

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  useEffect(() => {
    if (isGetDetailSuccess && isGetDebtorSuccess) {

      setDebtorId(pipelineDetail?.debtorId);
      setDebtorName(pipelineDetail?.debtorName);

      // Record activity for viewing pipeline detail
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: pipelineDetail?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline detail',
      });

      setFormPipelineData({
        analyst: {
          id: pipelineDetail?.analystId ?? '',
          label: pipelineDetail?.analystId ? pipelineDetail?.analystName : '',
        },
        createdDate: new Date(pipelineDetail?.createdAt),
        dataSource: pipelineDetail?.dataSource,
        debtorName: pipelineDetail?.debtorName,
        debtorRating: data?.debtorRating,
        debtorType: data?.debtorOwnerships,
        divisionId: pipelineDetail?.division,
        documentNpwp: data.npwpFile ? {
          extension: `.${data.npwpFile.split('/').pop().split('.').pop()}`,
          name: data.npwpFile.split('/').pop().split('.')[0],
          url: data.npwpFile,
        } : null,
        financingType: pipelineDetail?.financeType,
        gam: {
          id: pipelineDetail?.gamId ?? '',
          label: pipelineDetail?.gamId ? pipelineDetail?.gamName : '',
        },
        group: {
          id: pipelineDetail?.groupId?.toString() ?? '',
          label: pipelineDetail?.groupId ? pipelineDetail?.groupName : '',
        },
        institutionTypeId: pipelineDetail?.institutionType,
        isExisting: data.isExisting,
        isGroup: data?.isGroup,
        isNewClient: pipelineDetail?.isNewClient,
        isRelatedToSmi: data?.isRelatedToSmi,
        modfiedDate: new Date(pipelineDetail?.modifiedAt),
        npwp: pipelineDetail?.npwp,
        processId: pipelineDetail?.bucketProcessId,
        refinaId: data?.refinaId,
        remarks: pipelineDetail?.remarks,
        rmId: pipelineDetail?.staffName,
        totalPlafond: {
          currency: pipelineDetail?.currency,
          value: pipelineDetail?.totalProposal,
        },
        typeProcess: pendingTypeProcessRef.current ?? pipelineDetail?.typeProcess,
      });
    }
  }, [isGetDebtorSuccess, isGetDetailSuccess, pipelineDetail, data, recordActivity]);

  const onSuccess = (showModal?: boolean, title?: string, route?: boolean) => {
    if (showModal) {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          if (route) {
            router.replace(pipeline.LIST_PAGE);
          }
        },
        title: title ? title : 'Data berhasil disimpan',
        type: 'success',
      });
      reset(keepPreviousData);
    } else {
      setDirtyMsg(undefined);
    }
  };

  const [lastSavedPipelinePayload, setLastSavedPipelinePayload] = useState<any>(null);

  const { data: savePipelineData, isPending: isSaveLoading, mutate: savePipeline } = useSavePipeline({
    onSuccess: () => {
      // Record activity for saving pipeline
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          debtor: lastSavedPipelinePayload?.debtor,
          pipeline: lastSavedPipelinePayload?.pipeline,
        }),
        changeBefore: JSON.stringify({
          debtor: {
            debtorId: pipelineDetail?.debtorId,
            debtorName: pipelineDetail?.debtorName,
          },
          pipeline: {
            analystId: pipelineDetail?.analystId,
            dataSource: pipelineDetail?.dataSource,
            financeType: pipelineDetail?.financeType,
            remarks: pipelineDetail?.remarks,
            totalPlafond: pipelineDetail?.totalProposal,
            typeProcess: pipelineDetail?.typeProcess,
          },
        }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved pipeline data',
      });

      setDirtyMsg(undefined);
    },
  });

  const [lastCommentPayload, setLastCommentPayload] = useState<any>(null);

  const { isPending: isSubmitHistoryLoading, mutate: submitHistory } = useSaveHistory({
    onSuccess: () => {
      // Record activity for saving comment history
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          comment: lastCommentPayload?.comment,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved comment history',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({
        type: 'success',
      });
    },
  });

  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const { isPending: isSubmitLoading, mutate: submitPipeline } = useSubmitPipeline({
    onError: (error?: any) => {
      const errorDetail =
        error?.response?.data?.errorDetail ||
        'Data gagal dikirim';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: () => {
      // Record activity for submitting pipeline
      const activityType = lastSubmitPayload?.action === 'SUBMIT' ? ActivityType.SUBMIT :
        lastSubmitPayload?.action === 'RETURN_TO_STAFF' ? ActivityType.RETURN_TO_MAKER :
          lastSubmitPayload?.action === 'CANCELED' ? ActivityType.REJECT :
            lastSubmitPayload?.action === 'REJECTED' ? ActivityType.REJECT :
              lastSubmitPayload?.action === 'GO_TO_MIP' ? ActivityType.SUBMIT :
                ActivityType.SUBMIT;

      recordActivity({
        activity: activityType,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          action: lastSubmitPayload?.action,
          comment: lastSubmitPayload?.comment,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: `successfully ${lastSubmitPayload?.action?.toLowerCase() || 'submitted'} pipeline`,
      });

      setDirtyMsg(undefined);
    },
  });

  const { isPending: isCheckingFacility, mutate: checkFinancingFacilityExist } = useCheckFinancingFacilityExist({
    onError: (error: any) => {
      const errorDetail = error?.message || 'Failed to check financing facility';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
  });

  const { mutateAsync: deleteFinancingFacilityAsync } = useDeleteFinancingFacility({ onSuccess: () => {} });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
    pipelineDetail?.institutionType
  );

  const handleSave = () => {

    if (!isValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => handleSavePipeline(),
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      handleSavePipeline();
    }
  };

  const handleSaveComment = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            bucketProcessId: processId,
            comment,
            module: TypeModule.PIPELINE,
            process: TypeProcess.PIPELINE,
          };

          setLastCommentPayload(payload);
          submitHistory(payload);
        },
      },
    );
  };


  const handleSavePipeline = async () => {
    const value = watch() as any;
    // Handle group yang bisa berupa object {id, label} atau string
    const groupId = typeof value?.group === 'object' ? value?.group?.id : value?.group;
    const selectedGroup = groupData?.contents?.find((group) => group.id === groupId);
    const groupName = selectedGroup?.name || value?.group?.label || null;
    const payload = {
      bucketMasterId: savePipelineData?.data.content.bucketMasterId,
      bucketProcessId: processId as string,
      debtor: {
        debtorId: pipelineDetail?.debtorId,
        debtorName: value?.debtorName,
        debtorOwnerships: value?.debtorType,
        debtorRating: value?.debtorRating,
        gamId: value?.gam?.id ? +value?.gam?.id : null,
        group: value?.isGroup && groupId ? groupId : null,
        groupName: value?.isGroup && groupId ? groupName : null,
        institutionType: value?.institutionTypeId,
        isGroup: value?.isGroup,
        isRelatedToSmi: value?.isRelatedToSmi,
        npwp: value?.npwp,
      },
      newDebtor: pipelineDetail?.isNewClient,
      pipeline: {
        analystId: value?.analyst?.id ? +value?.analyst?.id : null,
        dataSource: value?.dataSource,
        financeType: value?.financingType,
        groupId: groupId ? groupId.toString() : null,
        remarks: value?.remarks,
        totalPlafond: value?.totalPlafond,
        typeProcess: value?.typeProcess,
      },
    };

    setLastSavedPipelinePayload(payload);
    savePipeline(payload, {
      onSuccess: () => {
        onSuccess(true, null, false);
      },
    });

  };

  const handleConfirmSubmit = async (value) => {
    if (isDirty) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => handleSubmit(value),
        submitText: 'Ya',
        title: 'Apakah Anda yakin ingin Submit data ini? Perubahan yang Anda buat tidak akan disimpan.',
        type: 'warning',
      });
    } else {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (value) => {
    const message = (value === 'SUBMIT') ? 'Data berhasil terkirim' : null;
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          checkFinancingFacilityExist(
            { bucketProcessId: processId },
            {
              onSuccess: (data: any) => {
                const isExist = data?.data?.content?.isExist;

                if (isExist) {
                  const existingBucketProcessId = data?.data?.content?.existingOngoingBucketProcessId;
                  showNiceModalV2({
                    title: `Financing facility data has been used by another ongoing PIPELINE process${existingBucketProcessId ? ` (${existingBucketProcessId})` : ''}`,
                    type: 'error',
                  });
                } else {
                  const payload: SubmitRequestDto = {
                    action: value,
                    bucketProcessId: processId,
                    comment,
                    module: TypeModule.PIPELINE,
                    process: TypeProcess.PIPELINE,
                  };

                  setLastSubmitPayload(payload);
                  submitPipeline(payload, {
                    onSuccess: () => onSuccess(true, message, true),
                  });
                }
              },
            }
          );
        },
      },
    );
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.PIPELINE,
            process: TypeProcess.PIPELINE,
          };

          setLastSubmitPayload(payload);
          submitPipeline(payload, {
            onSuccess: () => { onSuccess(true, null, true); },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCELED' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
      },
    );
  };


  const handleBackToPipelineList = () => {
    router.replace(pipeline.LIST_PAGE);
  };

  const isActionLoading = useMemo(() => {
    return isSaveLoading
      || isSubmitLoading || isSubmitHistoryLoading || isCheckingFacility;
  }, [isSaveLoading, isSubmitLoading, isSubmitHistoryLoading, isCheckingFacility]);

  const handleButton = (key: string, value: string) => {
    console.log(key);
    switch (key) {
      case 'GO_TO_ANNUAL_REVIEW':
        return pipelineDetail?.typeProcess === TypeProcess.ANNUAL_REVIEW ? (
          <Button
            isLoading={isActionLoading}
            variant="contained"
            color="success"
            onClick={() => handleGoToAnnualReview(value)}
          >
            Go To Annual Review
          </Button>
        ) : null;
      case 'GO_TO_FAST_TRACK':
        return pipelineDetail?.typeProcess === TypeProcess.FAST_TRACK ? (
          <Button
            isLoading={isActionLoading}
            variant="contained"
            color="success"
            onClick={() => handleGoToFastTrack(value)}
          >
            Go To Fast Track
          </Button>
        )
          : null;
      case 'GO_TO_MIP':
        return pipelineDetail?.typeProcess !== TypeProcess.ANNUAL_REVIEW &&
        pipelineDetail?.typeProcess !== TypeProcess.FAST_TRACK ?
          (
            <Button
              isLoading={isActionLoading}
              variant="contained"
              color="success"
              onClick={() => handleGoToMip(value)}
            >
              Go To MIP
            </Button>
          ) : null;
      case 'SAVE':
        return (
          <Button
            isLoading={isActionLoading}
            disabled={isAutoSaveFetching}
            onClick={handleSave}
          >
            {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
          </Button>
        );
      case 'COMMENT':
        return (
          <Button
            isLoading={isActionLoading}
            onClick={handleSaveComment}
          >
            Comment
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            disabled={!isProgessCompleted || !isValid}
            isLoading={isActionLoading}
            variant="contained"
            color="info"
            onClick={() => handleSubmit(value)}
          >
            Return to Staff
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            disabled={!isProgessCompleted || !isValid}
            isLoading={isActionLoading}
            variant="contained"
            color="info"
            onClick={() => handleSubmit(value)}
          >
            Return to Maker
          </Button>
        );
      case 'DECLINE':
        return (
          <Button
            isLoading={isActionLoading}
            variant="outlined"
            color="error"
            onClick={handleDecline}
          >
            Decline
          </Button>
        );
      case 'CLOSE':
        return (
          <Button
            variant="outlined"
            onClick={handleBackToPipelineList}
          >
            Close
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            isLoading={isActionLoading}
            color="success"
            disabled={!isProgessCompleted || !isValid}
            onClick={() => handleConfirmSubmit(value)}
          >
            { isRM || (isSuperAdminMaker && pipelineDetail?.status !== PIPELINE_STATUS.WAITING_APPROVAL_TL) ? 'Submit' : 'Approve'}
          </Button>
        );
    }
  };

  const {
    control,
    formState: { isValid, isDirty },
    reset,
    watch,
    setValue,
  } = useForm({
    context: { isExistingDebtor: data?.isExisting, isPemda },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(VALIDATION_SCHEMA),
  });

  const watchedValues = watch();
  const currentTypeProcess = watch('typeProcess');
  const committedTypeProcessRef = useRef<string | null>(null);
  const pendingTypeProcessRef = useRef<string | null>(null);

  useEffect(() => {
    if (committedTypeProcessRef.current === null) {
      if (currentTypeProcess) {
        committedTypeProcessRef.current = currentTypeProcess;
        pendingTypeProcessRef.current = currentTypeProcess;
      }
      return;
    }

    if (currentTypeProcess === committedTypeProcessRef.current) return;

    const previousIsAnnualReview = committedTypeProcessRef.current === TypeProcess.ANNUAL_REVIEW;
    const currentIsAnnualReview = currentTypeProcess === TypeProcess.ANNUAL_REVIEW;
    const isAnnualReviewSwitch = previousIsAnnualReview !== currentIsAnnualReview;

    const hasFacilities = (facilityListData?.contents?.length ?? 0) > 0;
    if (hasFacilities && isAnnualReviewSwitch) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onCancel: () => setValue('typeProcess', committedTypeProcessRef.current),
        onSubmit: () => {
          const facilitiesToDelete = facilityListData?.contents ?? [];
          committedTypeProcessRef.current = currentTypeProcess;
          pendingTypeProcessRef.current = currentTypeProcess;
          Promise.all(facilitiesToDelete.map((facility) => deleteFinancingFacilityAsync({ id: facility.id })));
        },
        submitText: 'Ya',
        title: 'Apakah anda yakin akan mengubah tipe proses? Data fasilitas sebelumnya tidak akan tersimpan.',
        type: 'warning',
      });
    } else {
      committedTypeProcessRef.current = currentTypeProcess;
      pendingTypeProcessRef.current = currentTypeProcess;
    }
  }, [currentTypeProcess]);

  const autoSavePayload = useMemo(() => () => {
    const value = watchedValues as any;
    const groupId = typeof value?.group === 'object' ? value?.group?.id : value?.group;
    const selectedGroup = groupData?.contents?.find((group) => group.id === groupId);
    const groupName = selectedGroup?.name || value?.group?.label || null;

    const payload = {
      bucketProcessId: processId as string,
      debtor: {
        debtorId: pipelineDetail?.debtorId,
        debtorName: value?.debtorName,
        debtorOwnerships: value?.debtorType,
        debtorRating: value?.debtorRating,
        gamId: value?.gam?.id ? +value?.gam?.id : null,
        group: value?.isGroup && groupId ? groupId : null,
        groupName: value?.isGroup && groupId ? groupName : null,
        institutionType: value?.institutionTypeId,
        isGroup: value?.isGroup,
        isRelatedToSmi: value?.isRelatedToSmi,
        npwp: value?.npwp,
      },
      newDebtor: pipelineDetail?.isNewClient,
      pipeline: {
        analystId: value?.analyst?.id ? +value?.analyst?.id : null,
        dataSource: value?.dataSource,
        financeType: value?.financingType,
        groupId: groupId ? groupId.toString() : null,
        remarks: value?.remarks,
        totalPlafond: value?.totalPlafond,
        typeProcess: value?.typeProcess,
      },
    };

    return Promise.resolve(payload);
  }, [watchedValues, pipelineDetail, data, processId, groupData]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !!pipelineDetail && !!data,
    payload: autoSavePayload,
    url: 'bucket.manage.savePipeline',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    }
  }, [isDirty, path]);

  useEffect(() => {
    reset(formPipelineData);
  }, [formPipelineData, reset]);


  function handleGoToFastTrack(value) {
    NiceModal.show(
      MODAL.FAST_TRACK.NOTIFICATION,
      {
        onSave: ({ depiStaff, dhStaff }: NotificationFormValues) => {
          closeNiceModal(MODAL.FAST_TRACK.NOTIFICATION);
          // TODO(BE): endpoint gabungan submit + notifikasi belum ada. Sampai tersedia,
          // objek `notification` diabaikan backend (FAIL_ON_UNKNOWN_PROPERTIES = false),
          // dan backend nanti yang menurunkan TL & Kadiv dari tiap id di bawah ini.
          const payload: SubmitRequestDto & { notification: NotificationRecipients } = {
            action: 'GO_TO_FAST_TRACK',
            bucketProcessId: processId,
            comment: '',
            module: TypeModule.PIPELINE,
            notification: {
              depiStaffIds: depiStaff.map(Number),
              dhStaffIds: dhStaff.map(Number),
              pipelineStaffId: pipelineDetail?.staffId,
            },
            process: TypeProcess.PIPELINE,
          };
          setLastSubmitPayload(payload);
          submitPipeline(payload, {
            onSuccess: () => successGoToFastTrack(),
          });
        },
        pipelineDetail,
        processId,
      },
    );
  }

  function successGoToFastTrack() {
    showNiceModalV2({
      onClose: () => router.push(fastTrack.REQUEST_PAGE),
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  }

  function handleGoToMip(value) {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: value,
            bucketProcessId: processId,
            comment,
            module: TypeModule.PIPELINE,
            process: TypeProcess.PIPELINE,
          };
          setLastSubmitPayload(payload);
          submitPipeline(payload, {
            onSuccess: () => successGoToMip(),
          });
        },
      },
    );
  }

  function handleGoToAnnualReview(value) {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          successGoToAnnualReview();
          const payload: SubmitRequestDto = {
            action: value,
            bucketProcessId: processId,
            comment,
            module: TypeModule.PIPELINE,
            process: TypeProcess.PIPELINE,
          };
          setLastSubmitPayload(payload);
          submitPipeline(payload, {
            onSuccess: () => successGoToAnnualReview(),
          });
        },
      },
    );
  }

  function successGoToMip() {
    showNiceModalV2({
      onClose: () => router.push(mip.LIST_PAGE),
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  }

  function successGoToAnnualReview() {
    showNiceModalV2({
      onClose: () => router.push(replacePath(annualReview.LIST_PAGE, { pageModule: 'request' })),
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  }

  const renderActionButtons =
    sortedObject
      ? Object.entries(sortedObject).map(([key, value]: [string, string]) => handleButton(key, value))
      : null;

  const renderEditMode = () => (
    <FormDebtor
      listText={[
        'Untuk mengubah data silakan ke Maintenance Customer'
      ]}
      disabledFields={formPipelineData?.isExisting ? DISABLED_FIELDS_EXISTING : DISABLED_FIELDS}
      mandatoryFields={formPipelineData?.isExisting ? MANDATORY_FIELDS_EXISTING : MANDATORY_FIELDS}
      control={control}
      setValue={setValue}
      watch={watch}
      userId={pipelineDetail?.staffId}
      debtorId={pipelineDetail?.debtorId}
      bucketProcessId={processId}
    />
  );

  const renderViewOnlyMode = () => (
    <PipelineDataViewOnly
      data={{
        ...pipelineDetail,
        debtorName: data?.debtorName || pipelineDetail?.debtorName,
        refinaId: data?.refinaId,
      }}
    />
  );

  const renderForm = viewOnly ? renderViewOnlyMode() : renderEditMode();

  return {
    isAutoSaveFetching,
    isLoading,
    isPemda,
    pipelineDetail,
    refinaId: data?.refinaId,
    renderActionButtons,
    renderForm,
    validateResult,
    viewOnly,
  };
};

export default useDetail;
