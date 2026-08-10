import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';
import { DetailControllerApi } from '@/services/openapi/credit-checking-service';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';


const detail = new DetailControllerApi();
const master = new DebtorV2ControllerApi();
const bucket = new ApplicationDebtorControllerApi();


const useGetDebtor = (
  payload: any,
  module?: string,
  isRequestMode?: boolean,
) => {
  const query = useQuery(
    {
      initialData: {
        debtorDataList: [],
        debtorDataPage: {},
        listDocuments: [],
      },
      placeholderData: keepPreviousData,
      queryFn: async () => {
        let res;

        switch (module) {
          case TypeModule.CREDIT_CHECKING:
            res = await detail.debtorDetailCreditChecking(payload);
            break;
          case TypeModule.MAINTENANCE_DEBTOR:
            res = await bucket.detailBucketDebtor(payload);
            break;
          default:
            res = await master.getDebtorDetail(payload);
            break;

        }

        const debtorData = res.data.data;
        if (debtorData) {
          const debtorDataRes = debtorData.content ? debtorData.content : debtorData.contents;
          const debtorDataPage = debtorData.page;
          const listDocuments = debtorData.content.listDocuments;


          const debtorDataList = {
            name: debtorDataRes.name || debtorDataRes.debtorName,
            ...debtorDataRes,
          };
          return {
            debtorDataList,
            debtorDataPage,
            listDocuments,
          };
        }

      },
      queryKey: [
        'debtor',
        isRequestMode,
        payload
      ],
    }
  );

  return query;
};


export default useGetDebtor;
