import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoString,
  SubmitHistorySiteVisitRequestDto,
} from '@/services/openapi/site-visit-service';


const api = new SiteVisitControllerApi();

const useSaveSiteVisitHistory = ({
  onSuccess = (res: BaseResponseGenericSingleDtoString) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitHistorySiteVisitRequestDto) => {
      const res = await api.saveHistorySiteVisitList(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ['site-visit-detail']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveSiteVisitHistory;
