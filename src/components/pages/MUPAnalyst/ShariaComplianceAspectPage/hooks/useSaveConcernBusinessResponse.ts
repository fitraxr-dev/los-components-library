import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConcernControllerApi } from '@/services/openapi/mip-service';


type SaveConcernBusinessResponseProps = {
  bucketProcessId: string;
  id?: number;
  module: string;
  process: string;
  type: string;
  businessResponse?: string;
  businessResponseDescription?: string;
};

const api = new ConcernControllerApi();

const useSaveConcernBusinessResponse = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      module,
      process,
      type,
      id,
      businessResponse,
      businessResponseDescription,
    }: SaveConcernBusinessResponseProps) => {
      const res = await api.saveConcernBusinessResponse(
        bucketProcessId,
        module,
        process,
        type,
        id,
        businessResponse,
        businessResponseDescription
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: SaveConcernBusinessResponseProps) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['concern-list', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
        type: variables.type,
      }]}),
      queryClient.invalidateQueries({ queryKey: ['concern-detail', { id: variables.id }]});
    },
  });

  return mutation;
};

export default useSaveConcernBusinessResponse;
