import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoString } from '@/services/openapi/notification-service';


const useGetDetailMaintenanceReminderBucket = (
  payload: RequestByIdDtoString,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const res = await API('notification.notification.getReminderTemplateSubmissionDetail', { data: payload });
          return res?.data;
        } catch (err) {
          console.error('API ERROR getReminderTemplateSubmissionDetail:', err);
          throw err;
        }
      },
      queryKey: [
        'maintenance-reminder-detail-bucket',
        payload
      ],
    }
  );

  return query;

};

export default useGetDetailMaintenanceReminderBucket;
