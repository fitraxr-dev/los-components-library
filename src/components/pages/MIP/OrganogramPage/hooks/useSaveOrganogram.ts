import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OrganogramControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


const api = new OrganogramControllerApi();

type SaveOrganoramDto = {
  bucketProcessId: string;
  description?: any;
  title?: string;
  module: TypeModule;
  process: TypeProcess;
}

const useSaveOrganogram = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, title, module, process }: SaveOrganoramDto) => {
      const res = await api.saveOrganogram(bucketProcessId, module, process, description, title);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['organogram', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveOrganogram;
