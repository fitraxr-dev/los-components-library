import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoString } from '@/services/openapi/notification-service';


const useGetDetailMaintenanceNotification = (
  payload: RequestByIdDtoString,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const res = await API('notification.notification.getDetailNotificationTemplate', { data: payload });
          return res?.data;
        } catch (err) {
          console.error('API ERROR getDetailNotificationTemplate:', err);
          throw err;
        }
      },
      queryKey: [
        'maintenance-notification-detail',
        payload
      ],
    }
  );

  return query;

};

export default useGetDetailMaintenanceNotification;
