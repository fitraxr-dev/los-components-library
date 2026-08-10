import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { parseNumber } from '@/helpers/utils';
import { ShareholderControllerApi } from '@/services/openapi/bucket-service';
import { RequestControllerApi, ResultControllerApi } from '@/services/openapi/credit-checking-service';
import { ShareholderControllerApi as MasterShareholderControllerApi } from '@/services/openapi/master-service';
import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';


const master = new MasterShareholderControllerApi();
const result = new ResultControllerApi();
const request = new RequestControllerApi();
const mip = new CreditCheckingExternalControllerApi();
const bucket = new ShareholderControllerApi();

const useGetShareholderList = (payload: any, module: string, process: string) => {
  const query = useQuery({
    initialData: {
      shareholderList: [],
      shareholderPage: {},
      totalPercentage: 0,
      totalShares: 0,
    },
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let res;

      switch (module) {
        case TypeModule.CREDIT_CHECKING:
          if (process === 'REQUEST') {
            res = await request.shareholderCreditChecking(payload);
          } else {
            res = await result.getListShareholderByBucketProcessId(payload);
          }
          break;
        case TypeModule.MIP:
          res = await mip.getListCreditCheckingShareholder(payload);
          break;
        case TypeModule.MAINTENANCE_DEBTOR:
          res = await bucket.getAllShareholderByDebtorId(payload);
          break;
        default:
          res = await master.getAllShareholderByDebtorId(payload);
          break;
      }

      const shareholderData = res.data.data;
      if (shareholderData) {
        const shareholderList = shareholderData?.contents;
        const shareholderPage = shareholderData?.page;
        const totalShares = shareholderList.reduce((total, item) => total + parseNumber(item.shares), 0);
        const totalPercentage = shareholderList.reduce((total, item) => total + item.percentage, 0);

        const tableDataShareholder = shareholderList.map((shareholder) => ({
          ...shareholder,
          collectibility: shareholder.collectabilityLabel ?? '-',
          googleResult: shareholder.googleResult ?? '-',
          lastCheckedDate: shareholder.createdDate ? formatDate(new Date(shareholder.createdDate)) : '-',
          nik: shareholder.nik ?? '-',
          note: shareholder.note ?? '-',
          resultReporting: shareholder.resultReporting ?? '-',
          type: shareholder.typeLabel ?? '-',
        }));

        return {
          shareholderPage,
          tableDataShareholder,
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
