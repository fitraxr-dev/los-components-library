import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  id: number | undefined;
  bucketProcessId: string;
  remark: string;
  process: TypeProcess;
  module: TypeModule;
}

const useSaveFinancingOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: SaveDto) => {
      const res = await API('mip.financingFacility.save', {
        data: {
          bucketProcessId: formData.bucketProcessId,
          id: formData.id,
          module: formData.module,
          process: formData.process,
          remark: formData.remark,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, formData) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-overview', { bucketProcessId: formData.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-validate']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveFinancingOverview;
