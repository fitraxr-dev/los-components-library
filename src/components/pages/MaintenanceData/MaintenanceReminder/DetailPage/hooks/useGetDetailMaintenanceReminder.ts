import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoString } from '@/services/openapi/notification-service';


const useGetDetailMaintenanceReminder = (
  payload: RequestByIdDtoString,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const res = await API('notification.notification.getDetailReminderTemplate', { data: payload });
          return res?.data;
        } catch (err) {
          console.error('API ERROR getDetailReminderTemplate:', err);
          throw err;
        }
      },
      queryKey: [
        'maintenance-reminder-detail',
        payload
      ],
    }
  );

  return query;

};

export default useGetDetailMaintenanceReminder;
