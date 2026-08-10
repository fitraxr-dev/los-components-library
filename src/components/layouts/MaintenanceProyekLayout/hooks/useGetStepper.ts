import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();


export const useGetProyekStepper = (
  payload: RequestByProcessIdDtoString,
) => {
  const query = useQuery(
    {
      enabled: (payload.bucketProcessId !== undefined || payload.bucketProcessId !== null)
        && !!payload.module && !!payload.process,
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getStepperMaintenanceProject(payload);
        return res?.data;
      },
      queryKey: [
        'proyek-stepper-list',
        payload.bucketProcessId
      ],
    }
  );

  return query;

};
