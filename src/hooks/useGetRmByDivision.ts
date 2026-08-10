import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetRmByDivision = (
  payload: any,
  options: Object = {
    division: 'division',
    label: 'fullName',
    value: 'userId',
  },
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('userManagement.lov.rmByDivisionList', { data: payload });
      const result = res.data.data.contents;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['rm-by-division', payload],
    select: (res: any) => res,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetRmByDivision;
