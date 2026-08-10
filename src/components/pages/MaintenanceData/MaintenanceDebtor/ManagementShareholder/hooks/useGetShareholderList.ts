import { useQuery } from '@tanstack/react-query';

import { parseNumber } from '@/helpers/utils';
import { ShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoGetByDebtorIdRequestDto } from '@/services/openapi/bucket-service';


const api = new ShareholderControllerApi();

const useGetShareholderList = (payload: GenericBucketRequestDtoGetByDebtorIdRequestDto) => {
  const query = useQuery({
    placeholderData: {
      shareholderList: [],
      shareholderPage: {},
      totalPercentage: 0,
      totalShares: 0,
    },
    queryFn: async () => {
      const res = await api.getAllShareholderByDebtorId(payload);
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
