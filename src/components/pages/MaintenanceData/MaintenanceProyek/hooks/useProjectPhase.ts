import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectControllerApi, ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type {
  DeleteProjectPhaseRequestDto,
  GenericBucketRequestDtoProjectPhaseFilterRequest,
  SaveProjectPhaseRequestDto,
} from '@/services/openapi/master-service';


const apiv1 = new ProjectControllerApi();
const apiv2 = new ProjectV2ControllerApi();
const api = new ProjectV2ControllerApi();


export const useGetProjectPhase = (
  payload: GenericBucketRequestDtoProjectPhaseFilterRequest,
) => {
  const queryClient = useQueryClient();

  // Get session storage values to include in query key
  const getSessionValues = () => {
    if (typeof window === 'undefined') return { maintenanceProyek: null, step: null };

    return {
      maintenanceProyek: sessionStorage.getItem('maintenance-proyek'),
      step: sessionStorage.getItem('step'),
    };
  };

  const sessionValues = getSessionValues();

  const query = useQuery(
    {
      enabled: !!payload?.filter.projectCode,
      placeholderData: keepPreviousData,
      queryFn: async () => {
        // Check session storage for step and maintenance-proyek
        let finalProjectCode = payload?.filter.projectCode;

        if (typeof window !== 'undefined') {
          const sessionStep = sessionStorage.getItem('step');
          const sessionMaintenanceProyek = sessionStorage.getItem('maintenance-proyek');

          // If step exists and equals '1', use maintenance-proyek value as projectCode
          if (sessionStep === '1' && sessionMaintenanceProyek) {
            finalProjectCode = sessionMaintenanceProyek;
          }
        }

        // Create modified payload with the final projectCode
        const modifiedPayload = {
          ...payload,
          filter: {
            ...payload.filter,
            projectCode: finalProjectCode,
          },
        };

        const res = await apiv1.projectPhaseAll(modifiedPayload);

        return res?.data;
      },
      queryKey: [
        'project-phase-list',
        payload,
        sessionValues.step,
        sessionValues.maintenanceProyek
      ],
    }
  );

  return query;
};

export const useSaveProjectPhase = ({
  onSuccess = (response: any, variable: SaveProjectPhaseRequestDto) => {},
  onError = (e) => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SaveProjectPhaseRequestDto) => {
      const res = await apiv2.saveProjectPhaseToProject(payload);
      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: (data, variable) => {
      onSuccess(data, variable);
    },
  });

  return mutation;

};

export const useDeleteProjectPhase = ({
  onSuccess = (response: any, variable: DeleteProjectPhaseRequestDto) => {},
  onError = (e) => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: DeleteProjectPhaseRequestDto) => {
      // Check session storage for step and maintenance-proyek
      let finalProjectCode = payload.projectCode;

      if (typeof window !== 'undefined') {
        const sessionStep = sessionStorage.getItem('step');
        const sessionMaintenanceProyek = sessionStorage.getItem('maintenance-proyek');

        // If step exists and equals '1', use maintenance-proyek value as projectCode
        if (sessionStep === '1' && sessionMaintenanceProyek) {
          finalProjectCode = sessionMaintenanceProyek;
        }
      }

      // Create modified payload with the final projectCode
      const modifiedPayload = {
        ...payload,
        projectCode: finalProjectCode,
      };

      // console.log('Original payload:', payload);
      // console.log('Modified payload:', modifiedPayload);

      const res = await apiv2.deleteProjectPhaseFromProject(modifiedPayload);
      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: (data, variable) => {
      // Update session storage if delete is successful
      if (typeof window !== 'undefined' && data?.data?.content?.bucketProcessId) {
        // Check if 'step' key exists in session storage
        const existingStep = sessionStorage.getItem('step');

        if (existingStep !== null) {
          // Update step to '1'
          sessionStorage.setItem('step', '1');

          // Update maintenance-proyek with bucketProcessId from response
          sessionStorage.setItem('maintenance-proyek', data.data.content.bucketProcessId);

          console.log('Session storage updated:', {
            'maintenance-proyek': data.data.content.bucketProcessId,
            step: '1',
          });
        }
      }

      onSuccess(data, variable);
    },
  });

  return mutation;
};
