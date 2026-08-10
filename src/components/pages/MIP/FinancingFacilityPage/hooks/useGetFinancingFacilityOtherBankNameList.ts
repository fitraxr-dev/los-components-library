import { useQuery } from '@tanstack/react-query';

import { FinancingFacilityOtherBankControllerApi } from '@/services/openapi/mip-service';

import type { GetListBankNameRequestDto, ParameterDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancingFacilityOtherBankControllerApi();

const useGetFinancingFacilityOtherBankNameList = (
  payload: GetListBankNameRequestDto,
  config?: Partial<UseQueryOptions<ParameterDto[]>>
) => {
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      const res = await api.getListBankName(payload);
      const listParameter = res?.data?.data?.listParameter;

      return listParameter.map((val) => ({
        id: val.key,
        label: val.value1,
      }));

    },
    queryKey: [
      'financingFacilityOtherBankNameList',
      payload
    ],
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityOtherBankNameList;
