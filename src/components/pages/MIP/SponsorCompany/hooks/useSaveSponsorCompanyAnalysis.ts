import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalysisSponsorCompanyControllerApi } from '@/services/openapi/mip-service';


const api = new AnalysisSponsorCompanyControllerApi();

const useSaveSponsorCompanyAnalysis = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveAnalysisSponsorCompany(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-sponsor-company-analysis', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: string;
  process: string;
}

export default useSaveSponsorCompanyAnalysis;
