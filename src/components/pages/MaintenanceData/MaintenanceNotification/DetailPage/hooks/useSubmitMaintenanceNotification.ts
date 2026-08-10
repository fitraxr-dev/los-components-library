import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitMaintenanceNotification = (options: any = {}) => {
  const mutation = useMutation({
    // mutationFn sekarang menerima payload langsung dengan tipe SubmitNotificationRequest
    mutationFn: async (submitNotificationRequest: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(submitNotificationRequest);
      return res.data;
    },
    // Gunakan onError dan onSuccess dari options
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};

export default useSubmitMaintenanceNotification;
