import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { ShareholderStructureRequestDto } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();

interface useSubmitBucketProps {
  submitRequestDto: ShareholderStructureRequestDto;
  options?: any;
}

const useSaveShareHoldingStructure = ({
  onSuccess = () => {},
  onError = (err) => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: useSubmitBucketProps) => {
      const { submitRequestDto, options } = payload;
      const res = await api.saveShareholderStructure(submitRequestDto, options);

      return res.data;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['apuppt-grouped-list']});
      onSuccess();
    },

  });

  return mutation;
};


export default useSaveShareHoldingStructure;
