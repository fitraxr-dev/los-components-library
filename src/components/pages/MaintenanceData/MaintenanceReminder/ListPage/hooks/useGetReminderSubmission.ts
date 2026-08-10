import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ReminderTemplateControllerApi } from '@/services/openapi/notification-service';

import type {
  GenericBucketRequestDtoTransactionReminderTemplateSubmissionFilterRequestDto,
} from '@/services/openapi/notification-service';


const api = new ReminderTemplateControllerApi();

const useGetReminderSubmission = (
  payload: GenericBucketRequestDtoTransactionReminderTemplateSubmissionFilterRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getReminderTemplateSubmission(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-reminder-submission',
        payload
      ],
    }
  );

  return query;

};

export default useGetReminderSubmission;
