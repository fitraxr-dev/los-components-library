import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { NotificationTemplateControllerApi } from '@/services/openapi/notification-service';

import type {
  GenericBucketRequestDtoTransactionNotificationTemplateSubmissionFilterRequestDto,
} from '@/services/openapi/notification-service';


const api = new NotificationTemplateControllerApi();

const useGetNotificationSubmission = (
  payload: GenericBucketRequestDtoTransactionNotificationTemplateSubmissionFilterRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getNotificationTemplateSubmission(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-notification-submission',
        payload
      ],
    }
  );

  return query;

};

export default useGetNotificationSubmission;
