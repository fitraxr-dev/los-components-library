import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ReminderTemplateControllerApi } from '@/services/openapi/notification-service';

import type { GenericBucketRequestDtoReminderTemplateFilterRequestDto } from '@/services/openapi/notification-service';


const api = new ReminderTemplateControllerApi();

const useGetListMaintenanceReminder = (
  payload: GenericBucketRequestDtoReminderTemplateFilterRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getReminderTemplate(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-reminder-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetListMaintenanceReminder;
