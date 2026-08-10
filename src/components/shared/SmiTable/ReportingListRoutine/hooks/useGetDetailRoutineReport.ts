import { useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import { RoutineReportingControllerApi as RoutineReportingAgreement } from '@/services/openapi/agreement-service';
import { RoutineReportingControllerApi as RoutineReportingMip } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong, RoutineReportingResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const mipApi = new RoutineReportingMip();
const agreementApi = new RoutineReportingAgreement();


const useGetDetailRoutineReport = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<RoutineReportingResponseDto>>,
  module?: TypeModule,
) => {
  const isEnabledByModule = [TypeModule.MIP_REVIEW, TypeModule.MUP].includes(module);
  const query = useQueries({
    combine: (results) => {
      const [mipResult, agreementResult] = results;
      switch (module) {
        case TypeModule.MIP_REVIEW:
          return mipResult;
        case TypeModule.RISALAH_RAPAT:
          return agreementResult;
        case TypeModule.MUP:
          return mipResult;
        default:
          return mipResult;
      }
    },
    queries: [
      {
        enabled: isEnabledByModule && payload.id !== undefined,
        queryFn: async () => {
          const res = await mipApi.getDetailRoutineReporting(payload);

          return res.data.data.content;
        },
        queryKey: ['get-detail-routine-reporting-mip', { id: payload.id }],
        staleTime: ONE_MINUTE,
        ...config,
      },
      {
        enabled: module === TypeModule.RISALAH_RAPAT && payload.id !== undefined,
        queryFn: async () => {
          const res = await agreementApi.getDetailRoutineReporting(payload);

          return res.data.data.content;
        },
        queryKey: ['get-detail-routine-reporting', { id: payload.id }],
        staleTime: ONE_MINUTE,
        ...config,
      }
    ],
  });
  return query;
};

export default useGetDetailRoutineReport;
