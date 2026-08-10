import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { parseNumber } from '@/helpers/utils';
import { CustomerShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoCustomerShareholderRequestDto } from '@/services/openapi/bucket-service';


const api = new CustomerShareholderControllerApi();

const useGetShareholderList = (payload: GenericBucketRequestDtoCustomerShareholderRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.listCustomerShareholder(payload);
      const shareholderData = res.data.data;

      if (shareholderData) {
        const shareholderList = shareholderData.contents;
        const shareholderPage = shareholderData.page;
        const totalShares = shareholderList?.reduce((total, item) => total + Number(item.shares), 0) || 0;
        const totalPercentage = shareholderList?.reduce((total, item) => total + Number(item.percentage), 0) || 0;

        return (
          {
            shareholderList,
            shareholderPage,
            totalPercentage,
            totalShares,
          }
        );
      }

      return {
        shareholderList: [],
        shareholderPage: {},
        totalPercentage: 0,
        totalShares: 0,
      };

    },
    queryKey: ['shareholders-list', payload],
  });

  return query;
};

export default useGetShareholderList;
