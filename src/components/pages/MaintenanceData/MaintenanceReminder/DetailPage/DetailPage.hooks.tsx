'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceReminder } from '@/configs/constants/pathname';
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
  useMaintenanceReminderContext,
} from '@/components/layouts/MaintenanceReminderLayout/MaintenanceReminder.context';

import { useDivisionSelection } from './hooks/useDivisionSelection';
import useGetDetailMaintenanceReminder from './hooks/useGetDetailMaintenanceReminder';
import useGetDetailMaintenanceReminderBucket from './hooks/useGetDetailMaintenanceReminderBucket';
import useSaveMaintenanceReminder from './hooks/useSaveMaintenanceReminder';
import useSubmitMaintenanceReminder from './hooks/useSubmitMaintenanceReminder';


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
  const { isReminderActive, activeType, reminderType, handleSetBreadcrumb } = useMaintenanceReminderContext();

  const action = searchParams.get('action'); // 'detail' atau 'edit'
  const flow = searchParams.get('flow');

  // cek id
  const [bucketProcessId, setBucketProcessId] = useState<string | null>(null);
  const isIdBucket = processId.includes('RMD');
  // kondisi gunakan id param jika sudah bucket
  const processIdToUse = bucketProcessId ?? (isIdBucket ? processId : null);

  // flagging hasSaved
  const [hasSaved, setHasSaved] = useState(false);

  // record log activity
  const { recordActivity } = useRecordLog();

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
  const bucketResult = useGetDetailMaintenanceReminderBucket({ id: processId });
  const normalResult = useGetDetailMaintenanceReminder({ id: processId });

  const { data, isLoading, isError } = action === 'detail-from-approval' || action === 'edit' ? bucketResult : normalResult;

  //   const { data: divisionList } = useGetParameterList('division');
  const { data: divisionList, isLoading: isDivisionLoading } = useGetParameterList('DIVISION');

  // derive initial selected division keys dari detail API (receivers)
  const content = data?.content;
  const hasFooter = !!content?.reminderFooter && String(content.reminderFooter).trim() !== '';

  const initialDivisionValues = useMemo(() => {
    if (!content?.receivers) return [];
    return Array.from(new Set(content.receivers
      .map((r: any) => r.divisionCode)
      .filter(Boolean)
    ));
  }, [content]);

  // helper untuk format date
  const formatDateForInput = (dateValue?: string | number[]) => {
    if (!dateValue) return '';

    // kalau array [YYYY, MM, DD, hh, mm, ss]
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      const [year, month, day] = dateValue;
      // pad month & day biar 2 digit
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // // kalau string biasa
    // if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    //   const d = new Date(dateValue);
    //   if (isNaN(d.getTime())) return '';
    //   return d.toISOString().split('T')[0];
    // }
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

  // helper di dalam hooks yang sama
  const safeString = (val: any) => typeof val === 'string' && val.trim() !== '' ? val : '';
  const buildDefaultValues = (content?: typeof data.content) => {
    if (!content) {
      return {
        receivers: [],
        tableGroup: {
          date: '',
          day: '',
          footer: '',
          reminderHeader: '',
          reminderSubject: '',
          scheduleType: '',
          startDate: '',
          startTime: '',
          time: '',

        },
      };
    }

    return {
      receivers: content.receivers ?? [],
      tableGroup: {
        date: formatDateForInput(content.date),
        day: content.day ?? '',
        footer: safeString(content.reminderFooter),
        reminderHeader: content.reminderHeader ?? '',
        reminderSubject: content.reminderSubject ?? '',
        scheduleType: content.scheduleType?.toLowerCase() ?? 'monthly',
        startDate: formatDateForInput(content.startDate),
        startTime: formatTimeForInput(content.startTime),
        time: content.time
          ? `${content.time[3]}:${content.time[4]}`
          : '',
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

  // // Sekarang tinggal pakai isDirty
  // useEffect(() => {
  //   console.log('======== Form changed? ----', isDirty);
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

  // default markDirty = false -> aman untuk inisialisasi / read-only
  const syncReceiversWithForm = (markDirty = false) => {
    const newReceivers = selectedDivisionsWithRoles.map((d) => ({
      divisionCode: d.division,
      roles: d.roles,
    }));

    // jika action === 'edit' dan markDirty === true, baru tandai dirty
    // jika action bukan 'edit' maka paksa markDirty false
    const finalMarkDirty = (action === 'edit' && flow !== 'waiting-approval') ? !!markDirty : false;

    setValue('receivers', newReceivers, { shouldDirty: finalMarkDirty });
  };


  // log setiap kali user toggle
  const handleToggleDivision = (division: string, selected: boolean) => {
    // console.log('>>> TOGGLE DIVISION', division, selected);
    toggleDivision(division, selected);
    syncReceiversWithForm(true);
  };

  const handleToggleRole = (division: string, role: string, selected: boolean) => {
    // console.log('>>> TOGGLE ROLE', division, role, selected);
    toggleRole(division, role, selected);
    syncReceiversWithForm(true);
  };

  const handleDeleteDivision = (division: string) => {
    // console.log('>>> DELETE DIVISION', division);
    deleteDivision(division);
    syncReceiversWithForm(true);
  };

  // Saat data API berubah, transform jadi state yang dibutuhkan
  useEffect(() => {
    if (data?.content?.receivers) {
      const { divisionOptions, initialDivisionValues, initialDataSelectedDivision } =
        transformApiData(data.content.receivers);

      setInitialDataState(initialDataSelectedDivision);
      setDivisionOptions(divisionOptions);
      setValueDivision(initialDivisionValues);
      setDivisionInitData(initialDataSelectedDivision);
    }
  }, [data]);

  const { mutate: saveReminderForm, isPending: saveFollowUpIsLoading } = useSaveMaintenanceReminder({
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
        module: TypeModule.MAINTENANCE_REMINDER,
        process: TypeProcess.MAINTENANCE_REMINDER,
        remarks: 'edit data in maintenance reminder',
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
          onClose: () => router.push(maintenanceReminder.LIST_PAGE),
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

  const handleSaveReminder = async (formValues: any, isFromTemplate?: boolean) => {
    const fileFooter = await convertToDocx(followUpContainer);

    // format receivers
    const formattedReceivers = selectedDivisionsWithRoles.flatMap((div) =>
      div.roles.map((role) => ({
        divisionCode: div.division,
        id: role.id,
        isActive: true,
        positionCode: role.positionCode,
        roleCode: '-',
      }))
    );

    // console.log('receivers: ', formattedReceivers);

    // saveReminderForm({
    const payload = {
      bucketProcessId: processIdToUse,
      date: toISO(formValues.tableGroup.date),
      day: formValues.tableGroup.day,
      isActive: isReminderActive,
      receivers: formattedReceivers,
      reminderFooter: fileFooter,
      reminderHeader: formValues.tableGroup.reminderHeader,
      reminderSender: data.content.reminderSender,
      reminderSubject: formValues.tableGroup.reminderSubject,
      scheduleType: formValues.tableGroup.scheduleType,
      startDate: toISO(formValues.tableGroup.startDate),
      startTime: toBackendTime(formValues.tableGroup.startTime),
      // templateCode: processId,
      templateCode: data.content.templateCode,
      templateType: reminderType,
      time: toBackendTime(formValues.tableGroup.time),

      // tambahkan flag
      // eslint-disable-next-line sort-keys, sort-keys-fix/sort-keys-fix
      isFromTemplate,
    };
    // });

    // console.log('--- Payload SaveReminder:', payload);
    saveReminderForm(payload);
  };

  // ------

  // Post Submit data
  const router = useRouter();
  const { mutate: submitReminder } = useSubmitMaintenanceReminder({
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
        module: TypeModule.MAINTENANCE_REMINDER,
        process: TypeProcess.MAINTENANCE_REMINDER,
        remarks: `User performed ${variables.action} in maintenance reminder`,
      });

      showNiceModalV2({
        onClose: () => router.push(maintenanceReminder.LIST_PAGE),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSubmit = (action: string) => {
    const basePayload = {
      bucketProcessId: processIdToUse,
      module: TypeModule.MAINTENANCE_REMINDER,
      process: TypeProcess.MAINTENANCE_REMINDER,
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

          submitReminder(payload);
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

          submitReminder(payload);
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

          submitReminder(payload);
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

          submitReminder(payload);
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

          submitReminder(payload);
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

          submitReminder(payload);
        },
      });
    }
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    const formValues = getValues();
    const fileFooter = await convertToDocx(followUpContainer);

    // format receivers
    const formattedReceivers = selectedDivisionsWithRoles.flatMap((div) =>
      div.roles.map((role) => ({
        divisionCode: div.division,
        id: role.id,
        isActive: true,
        positionCode: role.positionCode,
        roleCode: '-',
      }))
    );

    const payload = {
      bucketProcessId: processIdToUse,
      date: toISO(formValues.tableGroup.date),
      day: formValues.tableGroup.day,
      isActive: isReminderActive,
      isFromTemplate: false,
      receivers: formattedReceivers,
      reminderFooter: fileFooter,
      reminderHeader: formValues.tableGroup.reminderHeader,
      reminderSender: data?.content?.reminderSender,
      reminderSubject: formValues.tableGroup.reminderSubject,
      scheduleType: formValues.tableGroup.scheduleType,
      startDate: toISO(formValues.tableGroup.startDate),
      startTime: toBackendTime(formValues.tableGroup.startTime),
      templateCode: data?.content?.templateCode,
      templateType: reminderType,
      time: toBackendTime(formValues.tableGroup.time),
    };

    return Promise.resolve(payload);
  }, [
    getValues,
    followUpContainer,
    selectedDivisionsWithRoles,
    processIdToUse,
    isReminderActive,
    data,
    reminderType,
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
    url: 'notification.notification.saveReminder',
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
    handleDeleteDivision,
    handleSaveReminder,
    handleSubmit,
    handleToggleDivision,
    handleToggleRole,
    // hasChanged: isDirty,
    hasChanged: (action === 'edit' && flow !== 'waiting-approval') ? isDirty : false,
    hasFooter,
    hasSaved,
    isAutoSaveFetching,
    isIdBucket,
    isLoading,
    methods,
    selectedDivisionsWithRoles,
    setValueDivision,
    syncReceiversWithForm,
    toggleDivision,
    toggleRole,
    valueDivision,
  };
};
