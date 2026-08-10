import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ShareholderControllerApi } from '@/services/openapi/bucket-service';
import { DetailControllerApi } from '@/services/openapi/credit-checking-service';
import { ShareholderControllerApi as MasterShareholderControllerApi } from '@/services/openapi/master-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const bucket = new ShareholderControllerApi();
const detail = new DetailControllerApi();
const master = new MasterShareholderControllerApi();

const useGetShareholder = (
  { payload, module, isRequestMode }: shareholderDetail,
  config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    enabled: payload.id !== null,
    initialData: {
      listDocuments: [],
      shareholderList: {},
      shareholderPage: {},
      totalPercentage: 0,
      totalShares: 0,
    },
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let res;

      if (module === TypeModule.CREDIT_CHECKING) {
        res = await detail.shareholderDetailCreditChecking(payload);
      } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.getShareholderById(payload);
      } else {
        res = await master.getShareholderById(payload);
      }

      const shareholderData = res.data.data;

      if (shareholderData) {
        const shareholderList = shareholderData.content;

        const shareholderPage = shareholderData.page;
        const totalShares = shareholderList?.shares;
        const totalPercentage = shareholderList?.percentage;

        return {
          listDocuments: shareholderList.listDocuments,
          shareholderList,
          shareholderPage,
          totalPercentage,
          totalShares,
        };
      }
    },
    queryKey: ['shareholder-detail', payload],
    ...config,
  });

  return query;
};

type shareholderDetail = {
  payload: any;
  module?: string;
  isRequestMode?: boolean;
}
export default useGetShareholder;
