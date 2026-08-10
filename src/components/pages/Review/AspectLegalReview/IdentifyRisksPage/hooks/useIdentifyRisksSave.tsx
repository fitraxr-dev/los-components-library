import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useIdentifyRisksSave = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PartialSaveExecutiveSummary) => {
      const {
        bucketProcessId,
        process,
        module,
        id,
        legalRiskType,
        otherLegalRiskType,
        riskDescription,
        riskMitigation,
      } = payload;
      const res = await api.saveIdentificationLegalRisk(
        bucketProcessId,
        process,
        module,
        id,
        legalRiskType,
        otherLegalRiskType,
        riskDescription,
        riskMitigation,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identify-legal-risks-save']});
      onSuccess();
    },
  });

  return mutation;
};

type PartialSaveExecutiveSummary = {
  id: number ;
  bucketProcessId: string;
  process: string;
  module: string;
  riskMitigation?: any;
  riskDescription?: any;
  legalRiskType: string;
  otherLegalRiskType?: string;
};


export default useIdentifyRisksSave;
