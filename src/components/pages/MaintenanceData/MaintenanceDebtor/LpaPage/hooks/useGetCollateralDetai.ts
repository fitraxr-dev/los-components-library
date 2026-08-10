import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetCollateralDetail = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('lpa.lpaDetail.getCollateralDetail', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-collateral-detail-data',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetCollateralDetail;
