import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { DECLINE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceModal } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMaintenanceModalContext } from '@/components/layouts/MaintenanceModalLayout/MaintenanceModal.context';

import useGetMaintenanceModalDetail from '../hooks/useGetMaintenanceModalDetail';
import useSaveMaintenanceDataModal from '../hooks/useSaveMaintenanceDataModal';


const useMaintenanceModalDetail = () => {
  const theme = useTheme();
  const { isTL,
    isKadiv,
    isRM,
    isSuperAdminMaker,
    isSuperAdminChecker,
    isWaitingApprovalChecker,
    actions } = useMaintenanceModalContext();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const pathList = maintenanceModal.MAIN_PAGE;
  const queryClient = useQueryClient();
  const [state] = useApp();

  const [savedFormData, setSavedFormData] = useState<any>(null);

  const { recordActivity } = useRecordLog();

  const effectiveViewOnly = isKadiv ? false : viewOnly;

  const methods = useForm({
    defaultValues: {
      approvedBy: '',
      capitalPositionDate: '',
      lastModifiedDate: '',
      modal: {
        currency: '',
        value: 0,
      },
    },
  });

  const { control, handleSubmit, reset, watch } = methods;

  const watchedModal = watch('modal');
  const watchedCapitalPositionDate = watch('capitalPositionDate');

  const parseNumeric = (value: any) => {
    if (value === undefined || value === null || value === '') return 0;
    const num = parseFloat(String(value).replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const isFormValid = useMemo(() => {
    const modalValue = parseNumeric(watchedModal?.value);
    const isModalValid = modalValue > 0 && (watchedModal?.currency ?? '').trim() !== '';
    const isCapitalDateValid = !!watchedCapitalPositionDate && String(watchedCapitalPositionDate).trim() !== '';
    return isModalValid && isCapitalDateValid;
  }, [watchedModal, watchedCapitalPositionDate]);

  const hasUnsavedChanges = useMemo(() => {
    if (!savedFormData) return false;

    const currentData = {
      capitalPositionDate: watchedCapitalPositionDate,
      modal: watchedModal,
    };

    const normalizeValue = (value) => {
      if (!value) return value;
      const numValue = parseFloat(String(value).replace(/,/g, ''));
      return isNaN(numValue) ? value : numValue.toFixed(2);
    };

    const hasChanges =
      currentData.capitalPositionDate !== savedFormData.capitalPositionDate ||
      currentData.modal?.currency !== savedFormData.modal?.currency ||
      normalizeValue(currentData.modal?.value) !== normalizeValue(savedFormData.modal?.value);

    return hasChanges;
  }, [watchedCapitalPositionDate, watchedModal, savedFormData]);

  const { data: detailData } = useGetMaintenanceModalDetail({
    bucketProcessId: processId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CAPITAL,
  });

  const exceptViewOnlyByDivision = (detailData as any)?.createdBy === 454 && ((detailData as any)?.lastApprovedBy === '-' || (detailData as any)?.lastApprovedBy === 'SA Maker');

  const isViewOnlyByDivision = useMemo(() => {
    if (!detailData) return false;

    const isSuperAdmin = isSuperAdminMaker || isSuperAdminChecker;
    const createdByDivision = (detailData as any)?.createdDivisionCode;
    const userDivisionCode = (state?.userData as any)?.userDivision?.divisionCode;

    if ((createdByDivision !== userDivisionCode) && (!exceptViewOnlyByDivision) && (!isSuperAdmin)) {
      return true;
    }

    return false;
  }, [detailData, state?.userData, isWaitingApprovalChecker]);

  useEffect(() => {
    if (detailData) {
      const formData = {
        approvedBy: detailData.lastApprovedBy || '-',
        capitalPositionDate: detailData.capitalPositionDate,
        lastModifiedDate: detailData?.lastModifiedDate ? toDateString(detailData.lastModifiedDate) : '',
        modal: {
          currency: detailData.currency,
          value: detailData.nominal,
        },
      };

      reset({
        ...formData,
        modal: {
          ...formData.modal,
          value: parseNumeric(formData.modal.value),
        },
      });

      setSavedFormData({
        capitalPositionDate: detailData.capitalPositionDate,
        modal: {
          currency: detailData.currency,
          value: parseNumeric(detailData.nominal),
        },
      });

      // Record initial page view activity
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-data-modal-detail',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CAPITAL,
        remarks: 'view maintenance data modal detail page',
      });
    }
  }, [detailData, recordActivity, processId]);

  const { mutate, isPending } = useSaveMaintenanceDataModal({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi Kesalahan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setSavedFormData({
        capitalPositionDate: watchedCapitalPositionDate,
        modal: watchedModal,
      });
      showNiceModalV2({
        title: 'Berhasil Menyimpan Data',
        type: 'success',
      });

      // Record SAVE activity
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(watchedModal),
        changeBefore: JSON.stringify(savedFormData),
        menuCode: 'maintenance-data-modal-detail',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CAPITAL,
        remarks: 'save maintenance data modal',
      });
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['get-capital-detail', { bucketProcessId: processId }]});
      showNiceModalV2({
        onClose: () => { },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = (data) => {
    mutate({
      bucketProcessId: processId,
      capitalPositionDate: data.capitalPositionDate,
      currency: data.modal.currency,
      nominal: data.modal.value,
    });
  };

  const onSuccess = () => {
    showNiceModalV2({
      onClose: () => {
        router.push(pathList);
      },
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  };

  const handleOpenSubmitModal = ({ action }: { action: string }) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          const bucketAction = radioValue === 1 || radioValue === '1' ? 'CANCELED' : 'REJECTED';
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          // Record REJECT activity for decline actions
          recordActivity({
            activity: ActivityType.REJECT,
            bucketProcessId: processId,
            changeAfter: JSON.stringify({ action: bucketAction, comment }),
            changeBefore: '',
            menuCode: 'maintenance-data-modal-detail',
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
            remarks: 'reject maintenance data modal detail',
          });

          submitBucket({
            submitRequestDto: {
              action: bucketAction,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CAPITAL,
            },
          }, {
            onError: (e: any) =>
              showNiceModalV2({ title: `<p>${e?.response?.data?.errorDetail ?? 'Something went wrong'}</p><p>(${e?.response?.data?.errorCode ?? '999'})</p>`, type: 'error' }),
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
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
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          // Record activity based on action type
          let activityType = ActivityType.SUBMIT;
          let remarks = 'submit maintenance data modal';

          if ((action === 'SUBMIT' && isKadiv)) {
            activityType = ActivityType.APPROVE;
            remarks = 'approve maintenance data modal';
          } else if (action === 'RETURN_TO_STAFF') {
            activityType = ActivityType.RETURN_TO_STAFF;
            remarks = 'return to staff maintenance data modal';
          } else if (action === 'RETURN_TO_TL') {
            activityType = ActivityType.RETURN_TO_TL;
            remarks = 'return to tl maintenance data modal';
          }

          recordActivity({
            activity: activityType,
            bucketProcessId: processId,
            changeAfter: JSON.stringify({ action, comment }),
            changeBefore: '',
            menuCode: 'maintenance-data-modal-detail',
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
            remarks: remarks,
          });

          submitBucket({
            submitRequestDto: {
              action: action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CAPITAL,
            },
          }, {
            onError: (e: any) => {
              showNiceModalV2({ title: `<p>${e?.response?.data?.errorDetail ?? 'Something went wrong'}</p><p>(${e?.response?.data?.errorCode ?? '999'})</p>`, type: 'error' });
            },
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              onSuccess();
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const isBucketActive = useMemo(() => { return Boolean(detailData?.bucketProcessId); }, [detailData]);

  const canSubmit = useMemo(() => {
    if (isKadiv || isTL) {
      return !hasUnsavedChanges;
    } else {
      return isFormValid && !hasUnsavedChanges;
    }
  }, [isKadiv, isFormValid, hasUnsavedChanges]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      capitalPositionDate: watchedCapitalPositionDate,
      currency: watchedModal?.currency,
      nominal: watchedModal?.value,
    };

    return Promise.resolve(payload);
  }, [processId, watchedCapitalPositionDate, watchedModal]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !effectiveViewOnly && !!detailData?.bucketProcessId && !isViewOnlyByDivision,
    payload: autoSavePayload,
    url: 'master.capital.save',
  });

  return {
    actions,
    canSubmit,
    control,
    handleOpenSubmitModal,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isBucketActive,
    isFormValid,
    isKadiv,
    isPending,
    isRM,
    isSubmitLoading,
    isSuperAdminChecker,
    isSuperAdminMaker,
    isTL,
    isViewOnlyByDivision,
    isWaitingApprovalChecker,
    methods,
    theme,
    viewOnly: effectiveViewOnly,
    watchedCapitalPositionDate,
    watchedModal,
  };
};


export default useMaintenanceModalDetail;
