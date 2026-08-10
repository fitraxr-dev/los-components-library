import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';
import { RequestControllerApi, ResultControllerApi } from '@/services/openapi/credit-checking-service';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';
import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';


const request = new RequestControllerApi();
const master = new DebtorV2ControllerApi();
const bucket = new ApplicationDebtorControllerApi();
const result = new ResultControllerApi();
const mip = new CreditCheckingExternalControllerApi();

const useGetDebtorList = (
  payload: any, module: string, process: string
) => {
  const query = useQuery(
    {
      initialData: {
        debtorDataList: [],
        debtorDataPage: {},
      },
      placeholderData: keepPreviousData,
      queryFn: async () => {
        let res;

        switch (module) {
          case TypeModule.CREDIT_CHECKING:
            if (process === 'REQUEST') {
              res = await request.debtorCreditChecking(payload);
            } else {
              res = await result.getListDebtorByBucketProcessId(payload);
            }
            break;
          case TypeModule.MAINTENANCE_DEBTOR:
            res = await bucket.detailBucketDebtor(payload);
            break;
          case TypeModule.MIP:
            res = await mip.getListCreditCheckingDebtor(payload);
            break;
          case TypeModule.MIP_REVIEW:
            res = await mip.getListCreditCheckingDebtor(payload);
            break;
          default:
            res = await master.getDebtorDetail(payload);
            break;
        }

        const debtorData = res.data.data;

        if (debtorData) {
          const debtorDataRes = debtorData.content ? debtorData.content : debtorData.contents;
          const debtorDataPage = debtorData.page;


          let debtorDataList = [];

          if (Array.isArray(debtorDataRes)) {

            debtorDataList = debtorDataRes.map((item) => ({
              name: item.name || item.debtorName,
              ...item,
            }));
          } else {

            debtorDataList = [{
              name: debtorDataRes.name || debtorDataRes.debtorName,
              ...debtorDataRes,
            }];
          }

          return {
            debtorDataList,
            debtorDataPage,
          };
        }
      },
      queryKey: [
        'debtor'
      ],
    }
  );

  return query;
};


export default useGetDebtorList;
