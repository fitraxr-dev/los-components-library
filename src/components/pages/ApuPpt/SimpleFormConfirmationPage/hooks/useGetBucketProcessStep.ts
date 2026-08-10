import { useQueries, keepPreviousData } from '@tanstack/react-query';

import { ParameterControllerApi } from '@/services/openapi/parameter-service';
import { DynamicStepperControllerApi } from '@/services/openapi/processor-service';

import type { DebtorInformationDetailDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { DynamicStepRequestDto } from '@/services/openapi/processor-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DynamicStepperControllerApi();
const api_param = new ParameterControllerApi();

type PartialBucketProcessStep = DynamicStepRequestDto & {
  paramModule: string;
}


const useGetBucketProcessStep = (
  payload: PartialBucketProcessStep,
  config?: Partial<UseQueryOptions<DebtorInformationDetailDto>>
) => {
  const { paramModule, ...res } = payload;
  const query = useQueries({
    combine: (results: any) => {
      const [bucketStep, moduleList] = results;
      const isSuccess = results.some((result) => result.isSuccess);
      const isLoading = results.some((result) => result.isLoading);
      const defaultChecked = bucketStep?.data?.map((res) => res?.key).filter((item) => item !== 'additional-information' && item !== 'simple-form-confirmation');

      const data = moduleList?.data?.map((res, idx) => ({
        ...res,
        id: `${res?.value}-${idx}`,
      }));

      return {
        data,
        defaultChecked,
        isLoading,
        isSuccess,
      };
    },
    queries: [
      {
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const response = await api.getStepperBucketProcess({ ...res });
          return response.data.data.contents;
        },
        queryKey: ['stepper-bucket-process', { ...res }],
      },
      {
        placeholderData: [],
        queryFn: async () => {
          const response = await api_param.getListParameterByModule({ module: paramModule });
          const result = response.data.data.listParameter;

          return result.map((data) => {
            const finalObject = {};

            for (const [key, value] of Object.entries({ label: 'value1', value: 'value2' })) {
              finalObject[key] = data[value];
            }

            return finalObject;
          });
        },
        queryKey: ['parameter-list-v2', { module: paramModule }],
      }],
  });

  return query;

};

export default useGetBucketProcessStep;
