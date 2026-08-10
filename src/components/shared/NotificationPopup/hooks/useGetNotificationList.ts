import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoLogNotificationFilterRequestDto } from '@/services/openapi/notification-service';


const useGetNotificationList = (
  payload: GenericBucketRequestDtoLogNotificationFilterRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const res = await API('notification.notification.getLogNotificationsDetail', { data: payload });
          return res?.data;
        } catch (err) {
          console.error('API ERROR getLogNotificationsDetail:', err);
          throw err;
        }
      },
      queryKey: [
        'notification-list',
        payload
      ],
      refetchInterval: 5000,
    }
  );

  return query;

};

export default useGetNotificationList;
