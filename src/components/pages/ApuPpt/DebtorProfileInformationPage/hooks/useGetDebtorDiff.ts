import { useQueries, keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';
import { ParameterControllerApi } from '@/services/openapi/parameter-service';
import { DynamicStepperControllerApi } from '@/services/openapi/processor-service';

import type { DebtorInformationDetailDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { DebtorProfileInformationResponseDto } from '@/services/openapi/mip-service';
import type { DynamicStepRequestDto } from '@/services/openapi/processor-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api_param = new ParameterControllerApi();
const api = new DebtorProfileInformationControllerApi();


type PartialDebtorDiffProps = {
  oldPalyoad: RequestByProcessIdDtoString;
  newPayload: RequestByProcessIdDtoString;
}

type ResponseDebtorDiffProps = {
  labelDiff: {
    [key: string]: string;
  }[];
  keyDiff: string[];
}

const useGetDebtorDiff = (
  payload: PartialDebtorDiffProps,
  config?: Partial<UseQueryOptions<ResponseDebtorDiffProps>>
) => {
  const query = useQuery({
    enabled: payload?.newPayload.bucketProcessId !== null || payload?.newPayload.bucketProcessId !== undefined,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { newPayload, oldPalyoad } = payload;
      const res = await api.getDetailDebtorProfileInformation(newPayload);
      const res_Old = await api.getDetailDebtorProfileInformation(oldPalyoad);

      const newObj = res?.data?.data?.content;
      const oldObj = res_Old?.data?.data?.content;
      const keyDiff = [];
      const labelDiff = [];

      for (let key in newObj) {
        if (oldObj[key] !== newObj[key])
          keyDiff.push(key);
        labelDiff.push({
          label: key,
          value: newObj[key],
        });
      }

      return {
        keyDiff,
        labelDiff,
      };

    },
    queryKey: ['get-debtor-information', payload.newPayload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDebtorDiff;
