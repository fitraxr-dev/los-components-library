import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { FinancingFacilityRequestDto } from '../FacilityOverview.type';


const useSaveFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityRequestDto) => {
      const res = await API('bucket.financialFacility.save', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacility;
