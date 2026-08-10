import { useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import { API } from '@/helpers/api';


const useGetListRoutine = (payload: any) => {
  const isEnabledByModule = [TypeModule.MIP_REVIEW, TypeModule.MUP].includes(payload.module);

  const query = useQueries({
    combine: (results) => {
      const [mipResult, agreementResult] = results;
      switch (payload.module) {
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
        enabled:
          isEnabledByModule &&
          Object.values(payload || {}).every((value) => !!value),
        queryFn: async () => {
          try {
            console.log('Calling API (MIP) with payload:', payload);
            const response = await API('mip.routineReporting.getList', {
              data: payload,
            });
            console.log('API response (MIP):', response);
            return response?.data?.data?.contents;
          } catch (error) {
            console.error('API error (MIP):', error);
            throw error;
          }
        },
        queryKey: ['get-list-routine-reporting', 'mip', payload],
        staleTime: ONE_MINUTE,
      },
      {
        enabled:
          payload.module === TypeModule.RISALAH_RAPAT &&
          Object.values(payload || {}).every((value) => !!value),
        queryFn: async () => {
          try {
            console.log('Calling API (Agreement) with payload:', payload);
            const response = await API('agreement.routineReporting.getList', {
              data: payload,
            });
            console.log('API response (Agreement):', response);
            return response?.data?.data?.contents;
          } catch (error) {
            console.error('API error (Agreement):', error);
            throw error;
          }
        },
        queryKey: ['get-list-routine-reporting', 'agreement', payload],
        staleTime: ONE_MINUTE,
      },
    ],
  });

  return query;
};

export default useGetListRoutine;
