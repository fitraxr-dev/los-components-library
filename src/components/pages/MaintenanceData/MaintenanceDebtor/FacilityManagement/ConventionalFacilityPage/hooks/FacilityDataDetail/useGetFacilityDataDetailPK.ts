import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetFacilityDataDetailPK = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('agreement.facility.detailPk', { data: payload });

          return response.data?.data?.content;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'conventional-facility-data-detail-pk',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetFacilityDataDetailPK;
