import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';
import { RequestControllerApi, ResultControllerApi } from '@/services/openapi/credit-checking-service';
import { ManagementControllerApi as MasterManagementControllerApi } from '@/services/openapi/master-service';
import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const master = new MasterManagementControllerApi();
const bucket = new ManagementControllerApi();
const result = new ResultControllerApi();
const request = new RequestControllerApi();
const mip = new CreditCheckingExternalControllerApi();

const useGetManagementList = (
  payload: any,
  module?: string,
  process?: string,
  config?: Partial<UseQueryOptions<any>>,
) => {
  const query = useQuery({
    initialData: {
      managementList: [],
      managementPage: {},
    },
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let res;

      switch (module) {
        case TypeModule.CREDIT_CHECKING:
          if (process === 'REQUEST') {
            res = await request.managementCreditChecking(payload);
          } else {
            res = await result.getListManagementByBucketProcessId(payload);
          }
          break;
        case TypeModule.MIP:
          res = await mip.getListCreditCheckingManagement(payload);
          break;
        case TypeModule.MAINTENANCE_DEBTOR:
          res = await bucket.getAllManagementByDebtorId(payload);
          break;
        default:
          res = await master.getAllManagementByDebtorId(payload);
          break;
      }

      const managementData = res.data.data;
      if (managementData) {
        const managementList = managementData.contents;
        const managementPage = managementData.page;
        return {
          managementList,
          managementPage,
        };
      }
    },
    queryKey: ['managements', payload],
    ...config,
  });

  return query;
};

export default useGetManagementList;
