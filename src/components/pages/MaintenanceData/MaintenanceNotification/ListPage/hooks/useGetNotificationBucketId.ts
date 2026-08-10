import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { NotificationTemplateControllerApi } from '@/services/openapi/notification-service';

import type { SaveBeforeEditNotificationRequestDto } from '@/services/openapi/notification-service';


const api = new NotificationTemplateControllerApi();

const useGetNotificationBucketId = (options: any = {}) => {
//   const mutation = useMutation({
//     mutationFn: async (userId: string, submitReminderRequest: SaveBeforeEditRequestDto) => {
//       const res = await api.saveBeforeEditReminderTemplate(userId, submitReminderRequest);
//       return res.data;
//     },
//     // Gunakan onError dan onSuccess dari options
//     onError: options.onError,
//     onSuccess: options.onSuccess,
//   });
  const mutation = useMutation({
    mutationFn: async ({ SaveBeforeEditNotificationRequestDto }:
    { userId: string; SaveBeforeEditNotificationRequestDto: SaveBeforeEditNotificationRequestDto }) => {

      const res = await api.saveBeforeEditNotificationTemplate(SaveBeforeEditNotificationRequestDto);
      return res.data;
    },
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};

export default useGetNotificationBucketId;
