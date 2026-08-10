import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitMaintenanceReminder = (options: any = {}) => {
  const mutation = useMutation({
    // mutationFn sekarang menerima payload langsung dengan tipe SubmitReminderRequest
    mutationFn: async (submitReminderRequest: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(submitReminderRequest);
      return res.data;
    },
    // Gunakan onError dan onSuccess dari options
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};

export default useSubmitMaintenanceReminder;
