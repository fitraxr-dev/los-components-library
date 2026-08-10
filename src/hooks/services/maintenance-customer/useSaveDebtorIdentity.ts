import { useMutation } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

// Helper function to safely extract file or return undefined
const safeGetFile = (fileField?: any): any | undefined => {
  // If there's no file field, return undefined
  if (!fileField) return undefined;

  // If it's a direct file object, return the file property
  if (fileField.file) return fileField.file;

  // Otherwise return undefined (for existing unchanged files)
  return undefined;
};

const useSaveDebtorIdentity = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const res = useMutation({
    mutationFn: async (
      payload: {
        bucketProcessId: string;
        module: string;
        process: string;
        debtorCode?: string;
        npwp: string;
        placeFounded: string;
        dateFounded: string;
        noNotaryDeed: string;
        firstNoNotaryDeed: string;
        firstNoNotaryDeedDate: string;
        lastNoNotaryDeed: string;
        lastNoNotaryDeedDate: string;
        noNotaryDeedFile: any;
        npwpFile: any;
        firstNotaryDeedFile: any;
        lastNotaryDeedFile: any;
        options?: any;
      }) => {

      // Destructure the payload using the schema field names
      const {
        bucketProcessId,
        module,
        process,
        debtorCode,
        npwp,
        placeFounded,
        dateFounded,
        noNotaryDeed,
        firstNoNotaryDeed,
        firstNoNotaryDeedDate,
        lastNoNotaryDeed,
        lastNoNotaryDeedDate,
        noNotaryDeedFile,
        npwpFile,
        firstNotaryDeedFile,
        lastNotaryDeedFile,
        options,
      } = payload;

      // Call API with correct field mapping
      const req = api.saveDetailCustomerMaintenanceDebtorIdentity(
        bucketProcessId,
        module,
        process,
        debtorCode,
        npwp,
        placeFounded,
        dateFounded,
        noNotaryDeed,
        firstNoNotaryDeed,
        firstNoNotaryDeedDate,
        lastNoNotaryDeed,
        lastNoNotaryDeedDate,
        noNotaryDeedFile,
        npwpFile,
        firstNotaryDeedFile,
        lastNotaryDeedFile,
        options
      );

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

export default useSaveDebtorIdentity;
