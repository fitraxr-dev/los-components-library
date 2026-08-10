import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';
import { DetailControllerApi } from '@/services/openapi/credit-checking-service';
import { ManagementControllerApi as MasterManagementControllerApi } from '@/services/openapi/master-service';


const master = new MasterManagementControllerApi();
const bucket = new ManagementControllerApi();
const detail = new DetailControllerApi();

const useGetManagement = (payload: any, module?: string) => {
  const query = useQuery({
    initialData: {
      listDocuments: [],
      managementList: {},
      managementPage: {},
    },
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let res;

      if (module === TypeModule.CREDIT_CHECKING) {
        res = await detail.managementDetailCreditChecking(payload);
      } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.getManagementById(payload);
      } else {
        res = await master.getManagementById(payload);
      }

      const managementData = res.data.data;

      if (managementData) {
        const managementList = managementData.content;

        const managementPage = managementData.page;

        const listDocuments = managementList.listDocuments;
        return {
          listDocuments,
          managementList,
          managementPage,
        };
      }
    },
    queryKey: ['management-detail', payload],
  });

  return query;
};


export default useGetManagement;
