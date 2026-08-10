import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { BmppSummaryRemarkRequestDto } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useSaveBmppSummaryRemark = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: BmppSummaryRemarkRequestDto) => {
      const res = await api.saveBmppSummaryRemark(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bmpp-summary-remark', variables]});
      onSuccess();
    },
  });
  return mutation;
};

export default useSaveBmppSummaryRemark;
