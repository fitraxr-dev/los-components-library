import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface VisitLocationRequest {
  bucketProcessId?: string;
  visitCode?: string;
  module?: string;
  process?: string;
  [key: string]: any;
}

interface VisitLocationResponse {
  data?: {
    content?: any;
  };
}

const useSaveSiteVisitLocation = ({
  onError = () => {},
  onSuccess = () => {},
}: {
  onError?: (error: any) => void;
  onSuccess?: (response: VisitLocationResponse, variables: VisitLocationRequest) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<VisitLocationResponse, Error, VisitLocationRequest>({
    mutationFn: async (payload: VisitLocationRequest) => {
      console.log('payload', payload);
      const res = await API('siteVisit.siteVisit.saveVisitLocation', {
        data: payload,
      });
      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-visit-selected-list']});
      onSuccess(data, variables);
    },
  });

  return mutation;
};

export default useSaveSiteVisitLocation;
