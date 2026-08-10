import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { createWhitelistedMutationKey } from '@/helpers/mutation';
import { LogNotificationControllerApi } from '@/services/openapi/notification-service';

import type { UpdateIsSeenRequestDto } from '@/services/openapi/notification-service';


const api = new LogNotificationControllerApi();

const useEditIsSeenNotification = (options: any = {}) => {
  const mutation = useMutation({
    // mutationFn sekarang menerima payload langsung dengan tipe SubmitReminderRequest
    mutationFn: async (submitReminderRequest: UpdateIsSeenRequestDto) => {
      const res = await api.updateLogNotificationSeen(submitReminderRequest);
      return res.data;
    },

    mutationKey: createWhitelistedMutationKey('notification-seen'),
    // Gunakan onError dan onSuccess dari options
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};

export default useEditIsSeenNotification;
