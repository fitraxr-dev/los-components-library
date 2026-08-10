import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadValidateDebtor {
  debtorId: string;
  debtorName: string;
  feature: string;
}

export interface ResponseValidateDebtor {
  hasDuplicate: boolean;
  hasSimilar: boolean;
  similarDebtorList?: any[];
}

const useValidateDebtor = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ResponseValidateDebtor, variables?: any, context?: any) => void;
  onError?: (error: any) => void;
}) => {
  const query = useMutation({
    mutationFn: async (payload: PayloadValidateDebtor) => {
      console.log('=== VALIDATING DEBTOR ===', payload);
      try {
        const res = await API('master.debtor.validateCheck', {
          data: payload,
        });
        console.log('=== VALIDATE DEBTOR RESPONSE ===', res);
        return res.data?.data?.content;
      } catch (error) {
        console.error('=== VALIDATE DEBTOR ERROR ===', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('=== VALIDATE DEBTOR MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== VALIDATE DEBTOR SUCCESS ===', data);
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};

export default useValidateDebtor;
