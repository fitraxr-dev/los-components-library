import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface DeleteProjectFacilityRequestDto {
  projectCode: string;
  facilityId: string;
}

export const useDeleteProjectFacility = ({
  onSuccess = (response: any, variable: DeleteProjectFacilityRequestDto) => {},
  onError = (e) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteProjectFacilityRequestDto) => {
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

      const modifiedPayload = {
        ...payload,
        facilityId: payload.facilityId,
        projectCode: finalProjectCode,
      };

      // console.log('Original payload:', payload);
      // console.log('Modified payload:', modifiedPayload);

      const response = await API('master.project.deleteFacility', { data: modifiedPayload });
      // console.log('Delete facility API response:', response);

      return response.data;
    },
    onError: (e) => {
      // console.error('Delete facility error:', e);
      onError(e);
    },
    onSuccess: async (data, variable) => {
      // console.log('Delete facility success:', data);

      // Update session storage if bucketProcessId is available
      if (data?.data?.content?.bucketProcessId && typeof window !== 'undefined') {
        sessionStorage.setItem('maintenance-proyek', data.data.content.bucketProcessId);
        sessionStorage.setItem('step', '1');
        // console.log('Updated maintenance-proyek session storage:', data.data.content.bucketProcessId);
        // console.log('Updated step session storage to: 1');
      }

      // Invalidate project-facility-list queries
      await queryClient.invalidateQueries({
        queryKey: ['project-facility-list'],
      });

      // Force refetch to update project facility UI immediately
      await queryClient.refetchQueries({
        queryKey: ['project-facility-list'],
      });

      // Invalidate project-member-list in case there are dependencies
      await queryClient.invalidateQueries({
        queryKey: ['project-member-list'],
      });

      onSuccess(data, variable);
    },
  });

  return mutation;
};
