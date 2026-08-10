import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoLogNotificationFilterRequestDto } from '@/services/openapi/notification-service';


const useGetListReminders = (
  id: string,
) => {
  const query = useQuery({
    enabled: !!id,
    queryFn: async () => {
      try {
        const requestDto: GenericBucketRequestDtoLogNotificationFilterRequestDto = {
          filter: { userId: id },
        };
        const response = await API('notification.notification.getLogReminders', { data: requestDto });
        console.log('Detail API response get list reminder:', response.data.contents);
        return response.data.contents;
      } catch (error) {
        console.error('API error get list reminder:', error);
        throw error;
      }
    },
    queryKey: ['notification-get-log-reminder', id],
  });

  return query;
};

export default useGetListReminders;
