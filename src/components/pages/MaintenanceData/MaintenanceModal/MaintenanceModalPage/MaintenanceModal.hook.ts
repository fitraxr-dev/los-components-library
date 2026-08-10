import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { DECLINE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import { useMaintenanceModalContext } from '@/components/layouts/MaintenanceModalLayout/MaintenanceModal.context';

import useGetBucketList from '../hooks/useGetBucketList';
import useGetMaintenanceModal from '../hooks/useGetMaintenanceModal';
import useSaveMaintenanceDataModal from '../hooks/useSaveMaintenanceDataModal';
import useSubmitMaintenanceModal from '../hooks/useSubmitMaintenanceModal';

import { modal } from './MaintenanceModal.constants';


const useMaintenanceModal = () => {
  const theme = useTheme();
  const { isBusinessDivision, isRM, isKadiv, isSuperAdminMaker,
    handleSetBreadcrumb, actions } = useMaintenanceModalContext();
  const queryClient = useQueryClient();
  const { processId, identity, userData } = useIdentity();
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [savedBucketProcessId, setSavedBucketProcessId] = useState<string | null>(null);
  const [savedFormData, setSavedFormData] = useState<any>(null);

  const [appState] = useApp();
  const stepper = appState.stepper;

  const { recordActivity } = useRecordLog();

  const { control, handleSubmit, reset, watch } = useForm({
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

  const { data: detailData } = useGetMaintenanceModal();

  const { data: bucketListData } = useGetBucketList({
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const watchedModal = watch('modal');
  const watchedCapitalPositionDate = watch('capitalPositionDate');

  const isFormValid = useMemo(() => {
    const isModalValid = watchedModal?.value > 0 && watchedModal?.currency?.trim() !== '';
    const isCapitalDateValid = !!watchedCapitalPositionDate && String(watchedCapitalPositionDate).trim() !== '';
    return isModalValid && isCapitalDateValid;
  }, [watchedModal, watchedCapitalPositionDate]);

  const bucketProcessIdFromList = useMemo(() => {
    if (bucketListData?.contents && bucketListData.contents.length > 0) {
      const draftBucket = bucketListData.contents.find((bucket) => bucket.status === 'Draft');
      return draftBucket?.bucketProcessId;
    }
    return null;
  }, [bucketListData]);

  const hasUnsavedChanges = useMemo(() => {
    if (!savedFormData) return false;

    const currentData = {
      capitalPositionDate: watchedCapitalPositionDate,
      modal: watchedModal,
    };

    return JSON.stringify(currentData) !== JSON.stringify(savedFormData);
  }, [watchedCapitalPositionDate, watchedModal, savedFormData]);


  useEffect(() => {
    if (detailData) {
      const formData = {
        approvedBy: detailData?.lastApprovedBy || '',
        capitalPositionDate: detailData.capitalPositionDate,
        lastModifiedDate: detailData?.lastModifiedDate ? toDateString(detailData.lastModifiedDate) : '',
        modal: {
          currency: detailData.currency,
          value: detailData.nominal,
        },
      };

      reset(formData);

      if (detailData.bucketProcessId) {
        setSavedBucketProcessId(detailData.bucketProcessId);
        setIsDataSaved(true);
        setSavedFormData({
          capitalPositionDate: detailData.capitalPositionDate,
          modal: {
            currency: detailData.currency,
            value: Number(detailData.nominal) || 0,
          },
        });
      }

      // Record initial page view activity
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: detailData.bucketProcessId || processId,
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-data-modal',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CAPITAL,
        remarks: 'view maintenance data modal page',
      });
    }
  }, [detailData, recordActivity, processId]);

  const { mutate, isPending } = useSaveMaintenanceDataModal({
    invalidateOnSuccess: false,
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi Kesalahan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      setIsDataSaved(true);

      const bucketProcessId = data?.bucketProcessId ||
        data?.data?.bucketProcessId ||
        data?.data?.content?.bucketProcessId ||
        data?.content?.bucketProcessId;

      if (bucketProcessId) {
        setSavedBucketProcessId(bucketProcessId);
      } else {

      }

      setSavedFormData({
        capitalPositionDate: watchedCapitalPositionDate,
        modal: watchedModal,
      });
      showNiceModalV2({
        title: 'Berhasil Menyimpan Data',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucketProcessId || bucketProcessIdFromList ||
          savedBucketProcessId || detailData.bucketProcessId || processId,
        changeAfter: JSON.stringify(watchedModal),
        changeBefore: JSON.stringify(savedFormData),
        menuCode: 'maintenance-data-modal',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CAPITAL,
        remarks: 'save maintenance data modal',
      });
    },
  });

  const handleSave = (data) => {
    mutate({
      bucketProcessId: savedBucketProcessId || detailData.bucketProcessId || processId,
      capitalPositionDate: data.capitalPositionDate,
      currency: data.modal.currency,
      nominal: data.modal.value,
    });
  };

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitMaintenanceModal({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi Kesalahan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => { },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOpenSubmitModal = ({ action }: { action: string }) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          const bucketAction = radioValue === 1 || radioValue === '1' ? 'CANCELED' : 'REJECTED';
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const finalBucketProcessId = String(
            savedBucketProcessId ||
            bucketProcessIdFromList ||
            detailData?.bucketProcessId ||
            processId
          );

          // Record REJECT activity for decline actions
          recordActivity({
            activity: ActivityType.REJECT,
            bucketProcessId: finalBucketProcessId,
            changeAfter: JSON.stringify({ action: bucketAction, comment }),
            changeBefore: '',
            menuCode: 'maintenance-data-modal',
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
            remarks: 'reject maintenance data modal',
          });

          submitBucket({
            action: bucketAction,
            bucketProcessId: finalBucketProcessId,
            comment,
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
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
          const finalBucketProcessId = savedBucketProcessId ||
            bucketProcessIdFromList ||
            detailData?.bucketProcessId ||
            processId;

          const finalAction = (action === 'COMPLETED' && isKadiv) ? 'COMPLETED' : action;

          // Record activity based on action type
          let activityType = ActivityType.SUBMIT;
          let remarks = 'submit maintenance data modal';

          if ((finalAction === 'SUBMIT' && isKadiv)) {
            activityType = ActivityType.APPROVE;
            remarks = 'approve maintenance data modal';
          } else if (finalAction === 'RETURN_TO_STAFF') {
            activityType = ActivityType.RETURN_TO_STAFF;
            remarks = 'return to staff maintenance data modal';
          } else if (finalAction === 'RETURN_TO_TL') {
            activityType = ActivityType.RETURN_TO_TL;
            remarks = 'return to tl maintenance data modal';
          }

          recordActivity({
            activity: activityType,
            bucketProcessId: finalBucketProcessId,
            changeAfter: JSON.stringify({ action: finalAction, comment }),
            changeBefore: '',
            menuCode: 'maintenance-data-modal',
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
            remarks: remarks,
          });

          submitBucket({
            action: finalAction,
            bucketProcessId: finalBucketProcessId,
            comment,
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CAPITAL,
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const handleApprovalModal = () => {
    // Record VIEW activity for approval modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: savedBucketProcessId || detailData?.bucketProcessId || processId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'maintenance-data-modal-approval',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CAPITAL,
      remarks: 'view approval modal',
    });

    NiceModal.show(modal.APPROVAL_MODAL);
  };

  const handleHistoryModal = () => {
    // Record VIEW activity for history modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: savedBucketProcessId || detailData?.bucketProcessId || processId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'maintenance-data-modal-history',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CAPITAL,
      remarks: 'view history modal',
    });

    NiceModal.show(modal.HISTORY_MODAL);
  };

  useEffect(() => {
    handleSetBreadcrumb([
      { label: `${detailData?.bucketProcessId ?? '-'}`, url: '' }
    ]);
  }, [detailData]);

  const isBucketActive = useMemo(() => { return Boolean(detailData?.bucketProcessId); }, [detailData]);

  const canSubmit = isDataSaved && isFormValid && !hasUnsavedChanges;

  return {
    actions,
    canSubmit,
    control,
    handleApprovalModal,
    handleHistoryModal,
    handleOpenSubmitModal,
    handleSave,
    handleSubmit,
    identity,
    isBucketActive,
    isBusinessDivision,
    isFormValid,
    isPending,
    isRM,
    isSuperAdminMaker,
    stepper,
    theme,
    userData,
  };
};


export default useMaintenanceModal;
