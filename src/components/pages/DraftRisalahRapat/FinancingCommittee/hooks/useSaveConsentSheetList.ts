import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { ConsentSheetListDivision } from './useGetConsentSheetList';
import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveConsentSheetListRequest {
  listDivision: ConsentSheetListDivision[];
  bucketProcessId: string;
}

interface SaveConsentSheetListResponse {
  content: string;
}

type UseSaveConsentSheetListProps =
  UseMutationOptions<SaveConsentSheetListResponse, Error, SaveConsentSheetListRequest>

const useSaveConsentSheetList = ({ onSuccess, ...queryOptions }: UseSaveConsentSheetListProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveConsentSheetListRequest) => {
      const res = await API('agreement.risalahRapatConsentSheet.saveList', {
        data: {
          ...payload,
          module: TypeModule.RISALAH_RAPAT,
          process: TypeProcess.RISALAH_RAPAT,
        },
      });

      return res?.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['consent-sheet-list']});
      queryClient.invalidateQueries({ queryKey: ['signer-count']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveConsentSheetList;
