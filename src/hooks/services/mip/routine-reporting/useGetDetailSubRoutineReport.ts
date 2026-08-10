import { useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDetailSubRoutineReport = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>,
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
          try {
            console.log('Calling API (mip) getDetailRoutineSubReporting with payload:', payload);

            const response = await API('mip.routine.getDetailRoutineSubReporting', {
              data: payload,
            });

            console.log('API response (mip.getDetailRoutineSubReporting):', response);
            return response?.data?.data?.content;
          } catch (error) {
            console.error('API error (mip.getDetailRoutineSubReporting):', error);
            throw error;
          }
        },
        queryKey: ['get-detail-sub-routine-reporting', { id: payload?.id }],
        staleTime: ONE_MINUTE,
        ...config,
        enabled: isEnabledByModule && payload?.id !== undefined,
      },
      {
        queryFn: async () => {
          try {
            console.log('Calling API (agreement) getDetailRoutineSubReporting with payload:', payload);

            const response = await API('agreement.routine.getDetailRoutineSubReporting', {
              data: payload,
            });

            console.log('API response (agreement.getDetailRoutineSubReporting):', response);
            return response?.data?.data?.content;
          } catch (error) {
            console.error('API error (agreement.getDetailRoutineSubReporting):', error);
            throw error;
          }
        },
        queryKey: ['get-detail-sub-routine-reporting', { id: payload?.id }],
        staleTime: ONE_MINUTE,
        ...config,
        enabled: module === TypeModule.RISALAH_RAPAT && payload?.id !== undefined,
      },
    ],
  });

  return query;
};

export default useGetDetailSubRoutineReport;
