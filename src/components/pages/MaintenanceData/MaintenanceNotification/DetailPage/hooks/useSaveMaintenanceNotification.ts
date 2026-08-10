import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { API } from '@/helpers/api';
import { NotificationTemplateControllerApi } from '@/services/openapi/notification-service';

import { BASE_PATH } from '../../../../../../services/openapi/notification-service/base'; // sesuaikan path ke file api.ts


const api = new NotificationTemplateControllerApi();

interface UseSaveMaintenanceNotificationOptions {
  onSuccess?: (data: any, variables: saveNotificationPayload, context?: unknown) => void;
  onError?: (error: any) => void;
}

type saveNotificationPayload = {
  bucketProcessId: string;
  templateCode: string;
  templateType: string;
  isActive: any;
  startDate: string;
  startTime: string;
  templateLosTitle: string;
  templateLosMessage: string;
  messageSubject: string;
  // notificationFooter: Blob;
  messageContent: Blob;
  // receivers: Array<NotificationReceiverRequestDto>;
  isFromTemplate?: boolean;
}

const useSaveMaintenanceNotification = ({
  onSuccess,
  onError,
}: UseSaveMaintenanceNotificationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, any, saveNotificationPayload>({
    mutationFn: async (payload: saveNotificationPayload) => {

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
      if (payload.startDate !== undefined) {
        formData.append('startDate', payload.startDate);
      }
      if (payload.startTime !== undefined) {
        formData.append('startTime', payload.startTime);
      }
      if (payload.templateLosTitle !== undefined) {
        formData.append('templateLosTitle', payload.templateLosTitle);
      }
      if (payload.templateLosMessage !== undefined) {
        formData.append('templateLosMessage', payload.templateLosMessage);
      }
      if (payload.messageSubject !== undefined) {
        formData.append('messageSubject', payload.messageSubject);
      }
      if (payload.messageContent !== undefined) {
        formData.append('messageContent', payload.messageContent);
      }

      // PERBAIKAN: Kirim receivers sebagai JSON string
      // if (payload.receivers && payload.receivers.length > 0) {
      //   // Pastikan receivers dalam format yang benar
      //   const cleanReceivers = payload.receivers.map((receiver) => ({
      //     divisionCode: receiver.divisionCode,
      //     id: receiver.id,
      //     isActive: receiver.isActive,
      //     positionCode: receiver.positionCode,
      //     roleCode: receiver.roleCode,
      //   }));

      //   console.log('Clean receivers:', cleanReceivers);
      //   console.log('Receivers JSON string:', JSON.stringify(cleanReceivers));

      //   // Append sebagai JSON string
      //   formData.append('receivers', JSON.stringify(cleanReceivers));
      // }

      console.log('=== SENDING REQUEST ===');

      // Gunakan BASE_PATH dari konfigurasi OpenAPI yang sudah ada
      // const response = await axios.post(
      //   `${BASE_PATH}/v1/notification-templates/save`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );

      const response = await API('notification.notification.saveTransactionNotificationTemplate',
        { data: payload, headers: {
          'Content-Type': 'multipart/form-data',
        } });

      return response.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['save-notification']});
      onSuccess?.(data, variables, context);
    },
  });

  return mutation;
};

export default useSaveMaintenanceNotification;
