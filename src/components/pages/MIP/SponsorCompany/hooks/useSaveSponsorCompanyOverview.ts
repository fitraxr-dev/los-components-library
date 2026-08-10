import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalysisSponsorCompanyOverviewControllerApi } from '@/services/openapi/mip-service';


const api = new AnalysisSponsorCompanyOverviewControllerApi();

const useSaveSponsorCompanyOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveAnalysisSponsorCompanyOverview(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-sponsor-company-overview', { bucketProcessId: variable.bucketProcessId }]});
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

export default useSaveSponsorCompanyOverview;
