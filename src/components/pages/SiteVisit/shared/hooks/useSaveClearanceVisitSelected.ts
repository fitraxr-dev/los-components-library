import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoVisitLocationResponseDto,
  BaseRequestDto,
} from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useSaveClearanceVisitSelected = ({
  onSuccess = (res: BaseResponseGenericSingleDtoVisitLocationResponseDto, variables) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: BaseRequestDto) => {
      const res = await api.clearanceSelectedVisit(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-visit-history']});
      queryClient.invalidateQueries({ queryKey: ['site-visit-selected-list']});
      onSuccess(data, variables);
    },
  });

  return mutation;
};

export default useSaveClearanceVisitSelected;
