import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface PrivySignerPayload {
  id?: number;
  directorateId?: string;
  directorateLabel?: string;
  staffId?: number;
  staffName?: string;
  divisionId?: string;
  divisionLabel?: string;
  jobPositionLabel?: string;
  consentRole?: string;
  consentRoleLabel?: string;
  sequence?: number;
  sku?: any;
  privyId?: string;
  signatureAmount?: number;
}

interface SubmitPrivyWithSignersPayload {
  bucketProcessId: string;
  documentId: number;
  module: string;
  process: string;
  signProcess: 'Serial' | 'Paralel';
  signers: PrivySignerPayload[];
}

const useSubmitPrivyWithSigners = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SubmitPrivyWithSignersPayload) => {
      const res = await API('agreement.risalahRapatPrivy.submit', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSubmitPrivyWithSigners;
