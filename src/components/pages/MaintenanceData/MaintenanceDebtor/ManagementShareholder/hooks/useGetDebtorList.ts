import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { GetDebtorRequestDto } from '@/services/openapi/master-service';


const master = new DebtorV2ControllerApi();

const useGetDebtorList = (payload: GetDebtorRequestDto) => {
  const query = useQuery(
    {
      initialData: {
        debtorDataList: [],
        debtorDataPage: {},
      },
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await master.getDebtorDetail(payload);


        const debtorData = res.data.data;

        if (debtorData) {
          const debtorDataRes = debtorData.content ? debtorData.content : debtorData.content;
          const debtorDataPage = debtorData.content;


          let debtorDataList = [];

          if (Array.isArray(debtorDataRes)) {

            debtorDataList = debtorDataRes.map((item) => ({
              name: item.name || item.debtorName,
              ...item,
            }));
          } else {

            debtorDataList = [{
              name: debtorDataRes.name || debtorDataRes.name,
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
