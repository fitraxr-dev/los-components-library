import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetFacilityDataDetailDetail = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.facilityConventional.facilityDataDetaildata', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'conventional-facility-data-detail',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetFacilityDataDetailDetail;
