import { useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import { RoutineReportingControllerApi as RoutineReportingAgreement } from '@/services/openapi/agreement-service';
import { RoutineReportingControllerApi as RoutineReportingMip } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong, RoutineSubReportingRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const mipApi = new RoutineReportingMip();
const agreementApi = new RoutineReportingAgreement();


const useGetDetailSubRoutineReport = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<RoutineSubReportingRequestDto>>,
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
        queryFn: async () => {
          const res = await mipApi.getDetailRoutineSubReporting(payload);

          return res.data.data.content;
        },
        queryKey: ['get-detail-sub-routine-reporting', { id: payload.id }],
        staleTime: ONE_MINUTE,
        ...config,
        enabled: isEnabledByModule && payload.id !== undefined,
      },
      {
        queryFn: async () => {
          const res = await agreementApi.getDetailRoutineSubReporting(payload);

          return res.data.data.content;
        },
        queryKey: ['get-detail-sub-routine-reporting', { id: payload.id }],
        staleTime: ONE_MINUTE,
        ...config,
        enabled: module === TypeModule.RISALAH_RAPAT && payload.id !== undefined,
      }
    ],
  });
  return query;
};

export default useGetDetailSubRoutineReport;
