import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type { SaveMaintenanceProjectRequest } from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();

const useSaveMaintenanceProyek = ({
  onSuccess = (response: any, variable: SaveMaintenanceProjectRequest) => {},
  onError = (e) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveMaintenanceProjectRequest) => {
      let modifiedPayload = { ...payload };

      // Cek session storage untuk step dan maintenance-proyek
      if (typeof window !== 'undefined') {
        const sessionStep = sessionStorage.getItem('step');
        const sessionMaintenanceProyek = sessionStorage.getItem('maintenance-proyek');

        // Jika step ada dan bernilai '1', gunakan maintenance-proyek sebagai bucketProcessId
        if (sessionStep === '1' && sessionMaintenanceProyek) {
          modifiedPayload = {
            ...payload,
            bucketProcessId: sessionMaintenanceProyek,
          };

          console.log('Session storage detected - using bucketProcessId:', sessionMaintenanceProyek);
        }
      }

      // console.log('Original payload:', payload);
      // console.log('Modified payload:', modifiedPayload);

      const res = await api.saveMaintenanceProject(modifiedPayload);

      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: async (data, variable) => {
      const bucketProcessId = data?.data?.content?.bucketProcessId || variable.bucketProcessId;

      if (bucketProcessId) {
        await queryClient.invalidateQueries({
          queryKey: ['proyek-stepper-list', bucketProcessId],
        });
      }

      // Call original onSuccess callback
      onSuccess(data, variable);
    },
  });

  return mutation;
};

export default useSaveMaintenanceProyek;
