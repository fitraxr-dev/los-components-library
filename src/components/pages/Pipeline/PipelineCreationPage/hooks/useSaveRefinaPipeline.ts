import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/bucket-service';


const api = new PipelineControllerApi();

interface SaveRefinaPipelinePayload {
  bucketProcessId: string;
  debtor: {
    debtorId: string;
    debtorName: string;
    debtorRating: string | null;
    debtorType: string;
    gamId: number;
    group: string;
    groupName: string;
    institutionType: string;
    isGroup: boolean;
    isRelatedToSmi: boolean | null;
    npwp: string | null;
  };
  refinaId: number;
  newDebtor: boolean;
  pipeline: {
    analystId: number | null;
    dataSource: string | null;
    financeType: string | null;
    groupId: string;
    remarks: string | null;
    typeProcess: string | null;
  };
}

const useSaveRefinaPipeline = ({
  onSuccess = (data) => {},
  onError = (_err?: unknown) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveRefinaPipelinePayload) => {
      const res = await api.savePipeline(payload);

      return res.data;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: async (data, variable) => {
      await queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      await queryClient.invalidateQueries({ queryKey: ['detail-bucket-debtor']});
      await queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ['pipeline'],
      });
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ['financing-facilities'],
      });
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveRefinaPipeline;
