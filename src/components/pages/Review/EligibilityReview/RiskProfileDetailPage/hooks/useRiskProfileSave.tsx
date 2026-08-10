import { useMutation } from '@tanstack/react-query';

import { RiskProfileControllerApi } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();

interface saveRiskProfileDto {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  riskType?: string;
  otherRiskType?: string;
  description?: any;
  mitigation?: any;
}

const useRiskProfileSave = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      description,
      id,
      mitigation,
      module,
      otherRiskType,
      process,
      riskType,
    }: saveRiskProfileDto) => {
      const res = await api.saveRiskProfile(
        bucketProcessId,
        process,
        module,
        id,
        riskType,
        otherRiskType,
        description,
        mitigation,
      );
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};


export default useRiskProfileSave;
