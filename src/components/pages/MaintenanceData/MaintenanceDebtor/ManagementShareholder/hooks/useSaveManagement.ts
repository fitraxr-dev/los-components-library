import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceManagementControllerApi } from '@/services/openapi/master-service';

import type { SaveManagementRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceManagementControllerApi();

interface UseSaveManagementProps {
  debtorId?: string;
  bucketProcessId?: string;
  city?: string;
  process?: string;
  module?: string;
  managementCode?: string;
  refId?: string;
  name?: string;
  title?: string;
  gender?: string;
  jobPosition?: string;
  placeOfBirth?: string;
  dob?: string;
  ethnicOrigin?: string;
  idType?: string;
  idNo?: string;
  idDocUrl?: string;
  identityExpiry?: string;
  personInCharge?: boolean;
  npwp?: string;
  npwpDocUrl?: string;
  nationality?: string;
  country?: string;
  address?: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  village?: string;
  postalCode?: string;
  telephone?: string;
  status?: string;
  managementRemark?: string;
  prefix?: string;
  suffix?: string;
}
const useSaveManagement = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UseSaveManagementProps) => {
      const {
        debtorId,
        bucketProcessId,
        module,
        process,
        managementCode,
        refId,
        name,
        prefix,
        suffix,
        title,
        gender,
        jobPosition,
        placeOfBirth,
        dob,
        ethnicOrigin,
        idType,
        idNo,
        identityExpiry,
        npwp,
        nationality,
        personInCharge,
        country,
        address,
        province,
        district,
        subDistrict,
        village,
        postalCode,
        telephone,
        status,
        managementRemark,
        idDocUrl,
        npwpDocUrl,
      } = payload;

      const res = await api.saveDetailCustomerMaintenanceManagement(
        debtorId,
        bucketProcessId,
        module,
        process,
        managementCode,
        refId,
        name,
        prefix,
        suffix,
        title,
        gender,
        jobPosition,
        placeOfBirth,
        dob,
        ethnicOrigin,
        personInCharge,
        idType,
        idNo,
        identityExpiry,
        npwp,
        nationality,
        country,
        address,
        province,
        district,
        subDistrict,
        village,
        postalCode,
        telephone,
        status,
        managementRemark,
        idDocUrl,
        npwpDocUrl,
      );

      return res.data;

    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['management-list']});
    },
  });

  return mutation;
};

export default useSaveManagement;
