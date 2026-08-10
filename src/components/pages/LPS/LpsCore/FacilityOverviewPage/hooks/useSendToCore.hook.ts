import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseSendToCoreProps {
  sendToCoreRequestDto: any;
  options?: any;
}

const useSendToCore = ({
  onSuccess = (data: any, variables: any) => {},
  onError = (e, variables?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: UseSendToCoreProps) => {
      const { sendToCoreRequestDto, options } = payload;
      const res = await API('master.lps.sendToCore', {
        data: sendToCoreRequestDto,
        ...options,
      });

      return res.data;
    },
    onError: (e, variables) => {
      onError(e, variables);
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
  });

  return mutation;
};


export default useSendToCore;
