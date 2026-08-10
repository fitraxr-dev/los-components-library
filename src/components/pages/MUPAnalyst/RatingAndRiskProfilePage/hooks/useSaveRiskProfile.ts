import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

// TODO
const api = new RiskProfileControllerApi();

const useSaveRiskProfile = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      bucketProcessId,
      riskType,
      businessResponse,
      process,
      module,
    }: SaveDto) => {
      // TODO
      const res = await api.saveRiskProfileMUP(
        bucketProcessId,
        process,
        module,
        id,
        riskType,
        businessResponse,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['risk-profile-list',
          {
            id: variable.id,
          }],
      });

      queryClient.invalidateQueries({
        queryKey: ['risk-profile-detail',
          {
            id: variable.id,
          }],
      });
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  riskType?: string;
  businessResponse?: any;
}

export default useSaveRiskProfile;
