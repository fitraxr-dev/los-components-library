import { useMutation } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { SaveRemarkRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useSaveRemarkManagement = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const res = useMutation({
    mutationFn: async (payload: SaveRemarkRequestDto) => {
      const req = api.saveRemarkMaintenanceManagement(payload);

      return req;
    },
    onError: () => {
      onError();
    },
    onSuccess() {
      onSuccess();
    },
  });

  return res;
};

export default useSaveRemarkManagement;
