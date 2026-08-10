import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProfileControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


const api = new ProfileControllerApi();

const useSaveProfile = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveProfile(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mup-profile',
        {
          bucketProcessId: variable.bucketProcessId,
          module: variable.module,
          process: variable.process,
        }],
      });
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  id: number;
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
}

export default useSaveProfile;
