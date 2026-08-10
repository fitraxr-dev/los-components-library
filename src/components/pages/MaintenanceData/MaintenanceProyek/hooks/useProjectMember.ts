import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type {
  DeleteProjectMemberRequestDto,
  GenericBucketRequestDtoProjectMemberFilterRequest,
  SaveProjectMemberRequestDto,
} from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();

export const useGetProjectMember = (
  payload: GenericBucketRequestDtoProjectMemberFilterRequest,
) => {
  const queryClient = useQueryClient();

  // Get session storage values to include in queryKey
  const getSessionValues = () => {
    if (typeof window !== 'undefined') {
      return {
        maintenanceProyek: sessionStorage.getItem('maintenance-proyek'),
        step: sessionStorage.getItem('step'),
      };
    }
    return { maintenanceProyek: null, step: null };
  };

  const sessionValues = getSessionValues();

  const query = useQuery(
    {
      enabled: payload?.filter.projectCode !== null,
      placeholderData: keepPreviousData,
      queryFn: async () => {
        // Check session storage for step and maintenance-proyek
        let finalProjectCode = payload.filter.projectCode;

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

        // console.log('Original payload:', payload);
        // console.log('Modified payload:', modifiedPayload);

        const res = await api.getListProjectMember(modifiedPayload);

        return res?.data;
      },
      queryKey: [
        'project-member-list',
        payload,
        sessionValues
      ],
    }
  );

  return query;
};

export const useSaveProjectMember = ({
  onSuccess = (response: any, variable: any) => { },
  onError = (e) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveProjectMemberRequestDto) => {
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

      const res = await api.saveProjectMemberToProject(modifiedPayload);
      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: async (data, variable) => {
      // Invalidate only project-member-list queries
      await queryClient.invalidateQueries({
        queryKey: ['project-member-list'],
      });

      // Force refetch to update UI immediately
      await queryClient.refetchQueries({
        queryKey: ['project-member-list'],
      });

      onSuccess(data, variable);
    },
  });

  return mutation;
};

export const useDeleteProjectMember = ({
  onSuccess = (response: any, variable: DeleteProjectMemberRequestDto) => {},
  onError = (e) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteProjectMemberRequestDto) => {
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

      const res = await api.deleteProjectMemberFromProject(modifiedPayload);
      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: async (data, variable) => {
      // Update session storage jika bucketProcessId tersedia
      if (data?.data?.content?.bucketProcessId && typeof window !== 'undefined') {
        sessionStorage.setItem('maintenance-proyek', data.data.content.bucketProcessId);
        sessionStorage.setItem('step', '1');
        // console.log('Updated maintenance-proyek session storage:', data.data.content.bucketProcessId);
        // console.log('Updated step session storage to: 1');
      }

      // Invalidate project-member-list queries
      await queryClient.invalidateQueries({
        queryKey: ['project-member-list'],
      });

      // Force refetch to update project member UI immediately
      await queryClient.refetchQueries({
        queryKey: ['project-member-list'],
      });

      // Invalidate and refetch project-facility-list queries
      await queryClient.invalidateQueries({
        queryKey: ['project-facility-list'],
      });

      // Force refetch to update project facility UI immediately
      await queryClient.refetchQueries({
        queryKey: ['project-facility-list'],
      });

      onSuccess(data, variable);
    },
  });

  return mutation;
};
