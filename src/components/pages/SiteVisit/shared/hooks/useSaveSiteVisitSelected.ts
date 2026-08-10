import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoVisitLocationResponseDto,
  SelectVisitRequestDto,
} from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useSaveSiteVisitSelected = ({
  onSuccess = (res: BaseResponseGenericSingleDtoVisitLocationResponseDto, variables) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: SelectVisitRequestDto[]) => {
      const res = await api.selectVisit(payload);

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

export default useSaveSiteVisitSelected;
