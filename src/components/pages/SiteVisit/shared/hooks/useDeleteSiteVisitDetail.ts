import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoVisitLocationResponseDto,
  BaseRequestDto,
} from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useDeleteSiteVisitDetail = ({
  onSuccess = (res: BaseResponseGenericSingleDtoVisitLocationResponseDto) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: BaseRequestDto) => {
      const res = await api.deleteSelectedVisit(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-visit-detail']});
      queryClient.invalidateQueries({ queryKey: ['site-visit-selected-list']});
      queryClient.invalidateQueries({ queryKey: ['site-visit-history']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDeleteSiteVisitDetail;
