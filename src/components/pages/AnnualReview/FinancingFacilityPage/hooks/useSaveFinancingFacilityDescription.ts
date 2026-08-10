import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UseSaveFinancingFacilityProps) => {
      const { bucketProcessId, process, module, remarkExisting, remarkOtherBank } = payload;
      const res = await API('mip.financingFacilityMip.save', {
        data: {
          bucketProcessId,
          module,
          process,
          remarkExisting,
          remarkOtherBank,
        } });
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityDescription']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityMipDetail', { id: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type UseSaveFinancingFacilityProps = {
  bucketProcessId: string;
  process: string; module: string;
  remarkExisting?: string;
  remarkOtherBank?: string;
};

export default useSaveFinancingFacility;
