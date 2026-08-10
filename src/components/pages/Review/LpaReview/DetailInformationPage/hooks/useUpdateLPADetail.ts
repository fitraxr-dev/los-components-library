import { useMutation, useQueryClient } from '@tanstack/react-query';


import { API } from '@/helpers/api';


const useUpdateLPADetail = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateLPADTO) => {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
          if (value instanceof Blob) {
            formData.append(key, value);
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await API('lpa.lpaInformation.update', {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpa-confirmation-difference']});
      queryClient.invalidateQueries({ queryKey: ['lpa-detail']});
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
      queryClient.invalidateQueries({ queryKey: ['documents']});
      onSuccess();
    },
  });

  return mutation;
};

type UpdateLPADTO = {
  id?: string;
  bucketProcessId?: string;
  module?: string;
  process?: string;
  kjpp?: string;
  reportNo?: string;
  reportDate?: string;
  assessmentDate?: string;
  siteVisitDate?: string;
  assessmentPurpose?: string;
  remark?: string;
  isIncludedInKjppPartner?: boolean;
  earningWeight?: number;
  costWeight?: number;
  marketWeight?: number;
  marketApproach?: boolean;
  costApproach?: boolean;
  earningApproach?: boolean;
  approachInformation?: any;
  reconciliation?: boolean;
  remarkIncludedInKjppPartner?: string;
  remarkReconciliation?: string;
  summaryLiquidation?: string;
  summaryMarketValue?: string;
  options?: any;
};

export default useUpdateLPADetail;
