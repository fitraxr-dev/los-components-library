import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { NotificationTemplateControllerApi } from '@/services/openapi/notification-service';

import type {
  GenericBucketRequestDtoNotificationTemplateFilterRequestDto,
} from '@/services/openapi/notification-service';


const api = new NotificationTemplateControllerApi();

const useGetListMaintenanceNotification = (
  payload: GenericBucketRequestDtoNotificationTemplateFilterRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        // const res = await api.getNotificationTemplate(payload);
        const res = await API('notification.notification.getNotificationTemplate', { data: payload });
        return res?.data;
      },
      queryKey: [
        'maintenance-notification-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetListMaintenanceNotification;
