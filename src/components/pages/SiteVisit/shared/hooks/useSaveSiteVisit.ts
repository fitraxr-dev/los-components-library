import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoString,
  SubmitSiteVisitRequestDto,
} from '@/services/openapi/site-visit-service';


const api = new SiteVisitControllerApi();

const useSaveSiteVisit = ({
  onSuccess = (res: BaseResponseGenericSingleDtoString, variables) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitSiteVisitRequestDto) => {
      const res = await api.saveSiteVisit(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      onSuccess(data, variables);
    },
  });

  return mutation;
};

export default useSaveSiteVisit;
