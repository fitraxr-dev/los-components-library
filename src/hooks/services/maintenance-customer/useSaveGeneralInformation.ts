import { useMutation } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { SaveDetailCustomerGeneralInformationRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useSaveGeneralInformation = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const res = useMutation({
    mutationFn: async (payload: SaveDetailCustomerGeneralInformationRequestDto) => {
      const req = api.saveDetailCustomerMaintenanceGeneralInformation(payload);

      return req;
    },
    onError: () => {
      onError();
    },
    onSuccess(data, variables, context) {
      onSuccess();
    },
  });

  return res;
};

export default useSaveGeneralInformation;
