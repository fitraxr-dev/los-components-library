import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


const useSaveShariaCompliance = ({
  onSuccess = (variable: any) => {},
  onError = (variable: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveShariaComplianceProps) => {
      const { id, isCheckDk, description, bucketProcessId, module, process } = payload;

      const formData = new FormData();

      formData.append('id', id?.toString() || '');
      formData.append('isCheckDk', isCheckDk?.toString() || '');
      formData.append('bucketProcessId', bucketProcessId || '');
      formData.append('module', module || '');
      formData.append('process', process || '');

      if (description instanceof Blob || description instanceof File) {
        formData.append('description', description);
      } else {
        formData.append('description', JSON.stringify(description));
      }

      const res = await API('mip.syariahCompliance.save', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['sharia-compliance-list']});
      queryClient.invalidateQueries({ queryKey: ['sharia-compliance-detail']});
      onSuccess(variable);
    },
  });

  return mutation;
};

type SaveShariaComplianceProps = {
  id?: number;
  isCheckDk?: string | boolean;
  description?: any;
  bucketProcessId?: string;
  module?: TypeModule;
  process?: TypeProcess;
}

export default useSaveShariaCompliance;
