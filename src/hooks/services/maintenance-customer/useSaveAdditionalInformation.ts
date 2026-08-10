import { useMutation } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { SaveDetailCustomerOtherCommonInformationRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useSaveAdditionalInformation = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const res = useMutation({
    mutationFn: async (payload: SaveDetailCustomerOtherCommonInformationRequestDto) => {
      const req = api.saveDetailCustomerMaintenanceOtherCommonInformation(payload);

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

export default useSaveAdditionalInformation;
