import { useMutation } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

interface saveRiskProfileDto {
  id: number;
  bucketProcessId: string;
  process: string;
  module: string;
  riskMitigation?: any;
  riskDescription: any;
  legalRiskType?: string;
  otherLegalRiskType?: string;
}

const useIdentifyRisksSave = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      id,
      legalRiskType,
      otherLegalRiskType,
      riskDescription,
      riskMitigation,
    }: saveRiskProfileDto) => {
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
      onSuccess();
    },
  });

  return mutation;
};


export default useIdentifyRisksSave;
