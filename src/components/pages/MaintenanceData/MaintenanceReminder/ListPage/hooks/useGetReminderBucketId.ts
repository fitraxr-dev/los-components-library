import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ReminderTemplateControllerApi } from '@/services/openapi/notification-service';

import type { SaveBeforeEditRequestDto } from '@/services/openapi/notification-service';


const api = new ReminderTemplateControllerApi();

const useGetReminderBucketId = (options: any = {}) => {
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
    mutationFn: async ({ submitReminderRequest }:
    { userId: string; submitReminderRequest: SaveBeforeEditRequestDto }) => {

      const res = await api.saveBeforeEditReminderTemplate(submitReminderRequest);
      return res.data;
    },
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};

export default useGetReminderBucketId;
