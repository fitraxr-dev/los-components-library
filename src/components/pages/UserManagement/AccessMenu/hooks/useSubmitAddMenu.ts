import { useMutation } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type { AccessMenuItemResponse, AccessMenuReadDetailRequest } from '@/services/openapi/user-management-service';


const api = new AccessMenuControllerApi();

const useSubmitAddMenu = ({
  onSuccess = (response: AccessMenuItemResponse[]) => { },
  onError = () => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: AccessMenuReadDetailRequest) => {
      const res = await api.retrieveItemMenuDetail(payload);

      return res.data.data.contents;
    },
    onError: () => {
      onError();
    },
    onSuccess: (response) => {
      onSuccess(response);
    },
  });
  return mutation;
};

export default useSubmitAddMenu;
