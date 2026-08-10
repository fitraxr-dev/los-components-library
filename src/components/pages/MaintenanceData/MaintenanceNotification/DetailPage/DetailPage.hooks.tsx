/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceNotification } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import {
  useMaintenanceNotificationContext,
} from '@/components/layouts/MaintenanceNotificationLayout/MaintenanceNotification.context';

import { useDivisionSelection } from './hooks/useDivisionSelection';
import useGetDetailMaintenanceNotification from './hooks/useGetDetailMaintenanceNotification';
import useGetDetailMaintenanceNotificationBucket from './hooks/useGetDetailMaintenanceNotificationBucket';
import useSaveMaintenanceNotification from './hooks/useSaveMaintenanceNotification';
import useSubmitMaintenanceNotification from './hooks/useSubmitMaintenanceNotification';


export type RoleType = { name: string; selected: boolean };

type DivisionType = {
  divisionCode: string;
  divisionName: string;
  roles: {
    id: number;
    positionCode: string;
    positionName: string;
    selected: boolean;
  }[];
};

const toISO = (value: string) => {
  if (!value) return null;
  return dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DDT00:00:00');
};

const toBackendTime = (time: string) => {
  if (!time) return null;
  const today = dayjs().format('YYYY-MM-DD'); // tanggal hari ini
  return dayjs(`${today} ${time}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:00');
};

const actionToActivity: Record<string, ActivityType> = {
  APPROVE: ActivityType.APPROVE,
  CANCELED: ActivityType.CANCEL,
  DECLINE: ActivityType.DECLINE,
  REJECTED: ActivityType.REJECT,
  RETURN_TO_MAKER: ActivityType.RETURN_TO_MAKER,
  SUBMIT: ActivityType.SUBMIT,
};

export const useDetailPage = (followUpContainer: any) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const processId = params.id as string;
  const { isNotificationActive, activeType, notificationType, mediaType, handleSetBreadcrumb }
   = useMaintenanceNotificationContext();

  const action = searchParams.get('action'); // 'detail' atau 'edit'
  const flow = searchParams.get('flow');

  // cek id
  const [bucketProcessId, setBucketProcessId] = useState<string | null>(null);
  const isIdBucket = processId.includes('NTF');
  // kondisi gunakan id param jika sudah bucket
  const processIdToUse = bucketProcessId ?? (isIdBucket ? processId : null);

  // record log activity
  const { recordActivity } = useRecordLog();

  // flagging hasSaved
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    handleSetBreadcrumb([
      {
        label: action === 'detail' || action === 'detail-from-approval'
          ? 'Detail Page'
          : action === 'edit'
            ? 'Edit Page'
            : '',
        url: '',
      },
    ]);
  }, []);

  const payload = {
    id: processId,
  };

  // fetch detail
  const bucketResult = useGetDetailMaintenanceNotificationBucket({ id: processId });
  const normalResult = useGetDetailMaintenanceNotification({ id: processId });

  const { data, isLoading, isError } = action === 'detail-from-approval' || action === 'edit' ? bucketResult : normalResult;

  const content = data?.content;
  const hasFooter = !!content?.messageContent && String(content.messageContent).trim() !== '';

  // helper untuk format date
  const formatDateForInput = (dateValue?: string | number[]) => {
    if (!dateValue) return '';

    // kalau array [YYYY, MM, DD, hh, mm, ss]
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      const [year, month, day] = dateValue;
      // pad month & day biar 2 digit
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // kalau string ISO (YYYY-MM-DDTHH:mm:ss)
    if (typeof dateValue === 'string') {
      const d = dayjs(dateValue, 'YYYY-MM-DDTHH:mm:ss');
      if (!d.isValid()) return '';
      return d.format('YYYY-MM-DD'); // format sesuai input <input type="date" />
    }
    return '';
  };

  const formatTimeForInput = (timeValue?: string | number[]) => {
    if (!timeValue) return '';

    // kalau array [YYYY, MM, DD, HH, mm]
    if (Array.isArray(timeValue) && timeValue.length >= 5) {
      const [, , , hour, minute] = timeValue;
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    // kalau string ISO / HH:mm
    if (typeof timeValue === 'string') {
    // kalau udah dalam format HH:mm langsung return
      if (/^\d{2}:\d{2}$/.test(timeValue)) return timeValue;

      const d = new Date(timeValue);
      if (isNaN(d.getTime())) return '';
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    return '';
  };

  // console.log('======== data detail: ', data);

  // helper di dalam hooks yang sama
  const safeString = (val: any) => typeof val === 'string' && val.trim() !== '' ? val : '';
  const buildDefaultValues = (content?: typeof data.content) => {
    if (!content) {
      return {
        tableGroup: {
          startDate: '',
          startTime: '',
          templateLosTitle: '',
          templateLosMessage: '',
          messageSubject: '',
          footer: '',

        },
      };
    }

    return {
      tableGroup: {
        startDate: formatDateForInput(content?.startDate || ''),
        startTime: formatTimeForInput(content?.startTime || ''),

        templateLosTitle: content.templateLosTitle || '',
        templateLosMessage: content.templateLosMessage || '',
        messageSubject: content.messageSubject || '',
        footer: safeString(content.messageContent || ''),
      },
    };
  };

  const methods = useForm({
    defaultValues: buildDefaultValues(data?.content), // fungsi helper
    mode: 'onChange',
    shouldUnregister: false,
  });

  // watch hasChanged form
  const { formState, reset, watch, getValues, setValue } = methods;
  const { isDirty } = formState; // <-- ini pengganti hasChanged

  // Saat data baru masuk dari API
  useEffect(() => {
    if (data?.content) {
      const defaults = buildDefaultValues(data.content);
      reset(defaults); // otomatis update defaultValues di RHF
    }
  }, [data, reset]);

  // Sekarang tinggal pakai isDirty
  // useEffect(() => {
  //   // console.log('======== Form changed? ----', isDirty);
  // }, [isDirty]);


  // Post Save data
  const [divisionInitData, setDivisionInitData] = useState<DivisionType[]>([]);
  const [valueDivision, setValueDivision] = useState<string[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ label: string; value: string }[]>([]);

  const {
    divisionsDisplay,
    selectedDivisionsWithRoles,
    addSelectedDivisions,
    toggleDivision,
    toggleRole,
    deleteDivision,
    transformApiData,
    setInitialDataState,
  } = useDivisionSelection(divisionInitData);

  const { mutate: saveNotificationForm, isPending: saveFollowUpIsLoading } = useSaveMaintenanceNotification({
    onError(error) {
      showNiceModalV2({
        title: error,
        type: 'error',
      });
    },
    onSuccess(data, variables) {
      // post record activity
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processIdToUse,
        changeAfter: JSON.stringify(variables),
        changeBefore: JSON.stringify(content),
        module: TypeModule.MAINTENANCE_NOTIFICATION,
        process: TypeProcess.MAINTENANCE_NOTIFICATION,
        remarks: 'edit data in maintenance notification',
      });

      setHasSaved(true);
      // set isDirty jadi false
      if (data?.content) {
        const defaults = buildDefaultValues(data.content);
        reset(defaults); // defaultValues jadi nilai "official" dari server
      }

      if (data?.content?.bucketProcessId) {
        setBucketProcessId(data.content.bucketProcessId);
      }

      // akses dari variables (payload yg kita kirim)
      if (variables?.isFromTemplate) {
        showNiceModalV2({
          onClose: () => router.push(maintenanceNotification.LIST_PAGE),
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      } else {
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
    },
  });

  const handleSaveNotification = async (formValues: any, isFromTemplate?: boolean) => {
    const fileFooter = await convertToDocx(followUpContainer);

    const selectedMedia: string[] = mediaType || [];
    const isSendEmail = selectedMedia.includes('email');
    const isSendLos = selectedMedia.includes('los');

    const payload = {
      isActive: isNotificationActive,
      startDate: toISO(formValues.tableGroup.startDate),
      startTime: formValues.tableGroup.startTime ? toBackendTime(formValues.tableGroup.startTime) : null,

      templateLosTitle: formValues.tableGroup.templateLosTitle,
      templateLosMessage: formValues.tableGroup.templateLosMessage,
      messageSubject: formValues.tableGroup.messageSubject,
      // notificationFooter: fileFooter,
      messageContent: fileFooter,

      bucketProcessId: processIdToUse,
      templateCode: data.content.templateCode,
      templateType: notificationType,
      mediaType: mediaType,

      isSendEmail,
      isSendLos,
      isFromTemplate,
    };

    // console.log('--- Payload SaveNotification:', payload);
    saveNotificationForm(payload);
  };

  // ------

  // Post Submit data
  const router = useRouter();
  const { mutate: submitNotification } = useSubmitMaintenanceNotification({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || 'Data gagal disimpan';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
      console.log('is error: ', error);
    },
    onSuccess: (response, variables) => {
      const activity = actionToActivity[variables.action] || ActivityType.EDIT;
      recordActivity({
        activity,
        bucketProcessId: processIdToUse,
        changeAfter: JSON.stringify(variables),
        module: TypeModule.MAINTENANCE_NOTIFICATION,
        process: TypeProcess.MAINTENANCE_NOTIFICATION,
        remarks: `User performed ${variables.action} in maintenance notification`,
      });

      showNiceModalV2({
        onClose: () => router.push(maintenanceNotification.LIST_PAGE),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSubmit = (action: string) => {
    const basePayload = {
      bucketProcessId: processIdToUse,
      module: TypeModule.MAINTENANCE_NOTIFICATION,
      process: TypeProcess.MAINTENANCE_NOTIFICATION,
    };

    if (action === 'REJECTED') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
        submitText: 'Reject',
      });
    }
    else if (action === 'SUBMIT') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
      });
    }
    else if (action === 'DECLINE') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          const bucketAction = radioValue === 1 || radioValue === '1' ? 'CANCELED' : 'REJECTED';
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
        radioLabel: 'Type',
        radioOptions: [
          { label: 'Canceled', value: '1' },
          { label: 'Rejected', value: '2' }
        ],
      });
    }
    if (action === 'CANCELED') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
        submitText: 'Canceled',
      });
    }
    else if (action === 'APPROVE') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
        submitText: 'Approve',
      });
    }
    else if (action === 'RETURN_TO_MAKER') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          const payload = {
            ...basePayload,
            action,
            comment,
          };

          submitNotification(payload);
        },
      });
    }
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    const formValues = getValues();
    const fileFooter = await convertToDocx(followUpContainer);

    const selectedMedia: string[] = mediaType || [];
    const isSendEmail = selectedMedia.includes('email');
    const isSendLos = selectedMedia.includes('los');

    const payload = {
      isActive: isNotificationActive,
      startDate: toISO(formValues.tableGroup.startDate),
      startTime: formValues.tableGroup.startTime ? toBackendTime(formValues.tableGroup.startTime) : null,
      templateLosTitle: formValues.tableGroup.templateLosTitle,
      templateLosMessage: formValues.tableGroup.templateLosMessage,
      messageSubject: formValues.tableGroup.messageSubject,
      messageContent: fileFooter,
      bucketProcessId: processIdToUse,
      templateCode: data?.content?.templateCode,
      templateType: notificationType,
      mediaType: mediaType,
      isSendEmail,
      isSendLos,
      isFromTemplate: false,
    };

    return Promise.resolve(payload);
  }, [
    getValues,
    followUpContainer,
    isNotificationActive,
    mediaType,
    processIdToUse,
    data,
    notificationType,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: action === 'edit' && flow !== 'waiting-approval' && !!processIdToUse,
    payload: autoSavePayload,
    url: 'notification.notification.saveTransactionNotificationTemplate',
  });


  return {
    action,
    addSelectedDivisions,
    bucketProcessId,
    data,
    deleteDivision,
    divisionOptions,
    divisionsDisplay,
    flow,
    followUpContainer,
    handleSaveNotification,
    handleSubmit,
    isIdBucket,
    isAutoSaveFetching,
    isLoading,
    methods,
    selectedDivisionsWithRoles,
    setValueDivision,
    toggleDivision,
    toggleRole,
    valueDivision,
    // hasChanged: isDirty,
    hasChanged: (action === 'edit' && flow !== 'waiting-approval') ? isDirty : false,
    hasFooter,
    hasSaved,
  };
};
