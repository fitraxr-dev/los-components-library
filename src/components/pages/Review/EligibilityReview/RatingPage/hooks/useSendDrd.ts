import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface DocumentItem {
  id: number;
}

interface SendMemoDrdPayload {
  idRatingDrd?: string;
  bucketProcessId?: string;
  debtorName?: string;
  division?: string;
  picName?: string;
  analystName?: string;
  documents: DocumentItem[];
  institutionType?: string;
}

interface SendMemoDrdResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const useSendDrd = (
  config?: {
    onSuccess?: (data: SendMemoDrdResponse) => void;
    onError?: (error: any) => void;
    onMutate?: () => void;
  }
) => {
  const mutation = useMutation<SendMemoDrdResponse, Error, SendMemoDrdPayload>({
    mutationFn: async (payload: SendMemoDrdPayload) => {
      const res = await API('bucketDocument.document.sendDrd', {
        data: payload,
      });

      return res.data?.data ?? { success: true };
    },
    onError: (error) => {
      config?.onError?.(error);
    },
    onMutate: () => {
      config?.onMutate?.();
    },
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },
  });

  return mutation;
};

export default useSendDrd;
