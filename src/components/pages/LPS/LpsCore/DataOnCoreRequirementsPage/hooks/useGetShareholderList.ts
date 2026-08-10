import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { parseNumber } from '@/helpers/utils';

import type { GenericBucketRequestDtoGetByDebtorIdRequestDto } from '../DataOnCoreRequirements.type';


const useGetShareholderList = (
  payload: GenericBucketRequestDtoGetByDebtorIdRequestDto,
  options?: any
) => {
  const query = useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.shareholder.list', {
        data: payload,
      });
      const shareholderData = res.data.data;
      if (shareholderData) {
        const shareholderList = shareholderData.contents;
        const shareholderPage = shareholderData.page;
        const totalShares = shareholderList.reduce((total, item) => total + parseNumber(item.shares), 0);
        const totalPercentage = shareholderList.reduce((total, item) => total + item.percentage, 0);

        return {
          shareholderList,
          shareholderPage,
          totalPercentage,
          totalShares,
        };
      }
    },
    queryKey: ['shareholders', payload],
  });

  return query;
};

export default useGetShareholderList;
