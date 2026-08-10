import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ReminderTemplateControllerApi } from '@/services/openapi/notification-service';

import { BASE_PATH } from '../../../../../../services/openapi/notification-service/base'; // sesuaikan path ke file api.ts

import type {
  TransactionReminderTemplateRequestDto,
  ReminderReceiverRequestDto,
} from '@/services/openapi/notification-service';


const api = new ReminderTemplateControllerApi();

interface UseSaveMaintenanceReminderOptions {
  onSuccess?: (data: any, variables: saveReminderPayload, context?: unknown) => void;
  onError?: (error: any) => void;
}

type saveReminderPayload = {
  bucketProcessId?: string;
  templateCode: string;
  templateType: string;
  isActive: boolean;
  scheduleType: string;
  time: string;
  day?: string;
  date?: string;
  startDate: string;
  startTime: string;
  reminderSubject: string;
  reminderHeader: string;
  reminderFooter: any;
  reminderSender: string;
  receivers: Array<ReminderReceiverRequestDto>;
  isFromTemplate?: boolean;
}

const useSaveMaintenanceReminder = ({
  onSuccess,
  onError,
}: UseSaveMaintenanceReminderOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, any, saveReminderPayload>({
    mutationFn: async (payload: saveReminderPayload) => {

      // Buat FormData manual untuk mengatasi bug OpenAPI generator
      const formData = new FormData();

      // Append semua field kecuali receivers
      if (payload.bucketProcessId !== undefined) {
        formData.append('bucketProcessId', payload.bucketProcessId);
      }
      if (payload.templateCode !== undefined) {
        formData.append('templateCode', payload.templateCode);
      }
      if (payload.templateType !== undefined) {
        formData.append('templateType', payload.templateType);
      }
      if (payload.isActive !== undefined) {
        formData.append('isActive', String(payload.isActive));
      }
      if (payload.scheduleType !== undefined) {
        formData.append('scheduleType', payload.scheduleType);
      }
      if (payload.time !== undefined) {
        formData.append('time', payload.time);
      }
      if (payload.day !== undefined) {
        formData.append('day', payload.day);
      }
      if (payload.date !== undefined) {
        formData.append('date', payload.date);
      }
      if (payload.startDate !== undefined) {
        formData.append('startDate', payload.startDate);
      }
      if (payload.startTime !== undefined) {
        formData.append('startTime', payload.startTime);
      }
      if (payload.reminderSubject !== undefined) {
        formData.append('reminderSubject', payload.reminderSubject);
      }
      if (payload.reminderHeader !== undefined) {
        formData.append('reminderHeader', payload.reminderHeader);
      }
      if (payload.reminderFooter !== undefined) {
        formData.append('reminderFooter', payload.reminderFooter);
      }
      if (payload.reminderSender !== undefined) {
        formData.append('reminderSender', payload.reminderSender);
      }

      // PERBAIKAN: Kirim receivers sebagai JSON string
      if (payload.receivers && payload.receivers.length > 0) {
        // Pastikan receivers dalam format yang benar
        const cleanReceivers = payload.receivers.map((receiver) => ({
          divisionCode: receiver.divisionCode,
          id: receiver.id,
          isActive: receiver.isActive,
          positionCode: receiver.positionCode,
          roleCode: receiver.roleCode,
        }));

        console.log('Clean receivers:', cleanReceivers);
        console.log('Receivers JSON string:', JSON.stringify(cleanReceivers));

        // Append sebagai JSON string
        formData.append('receivers', JSON.stringify(cleanReceivers));
      }

      console.log('=== SENDING REQUEST ===');

      // Gunakan BASE_PATH dari konfigurasi OpenAPI yang sudah ada
      const response = await axios.post(
        `${BASE_PATH}/v1/reminder-templates/save`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['save-reminder']});
      onSuccess?.(data, variables, context);
    },
  });

  return mutation;
};

export default useSaveMaintenanceReminder;
