import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface Payload {
  debtorId: string;
  isAlertShow: boolean;
}

const useUpdateDataOnCoreRequirementsResult = () => {
  return useMutation({
    mutationFn: (payload: Payload) =>
      API('master.debtor.dataOnCoreRequirementsResult', {
        data: payload,
      }),
  });
};

export default useUpdateDataOnCoreRequirementsResult;
