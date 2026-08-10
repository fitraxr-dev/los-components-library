import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface AddFacilityProjectRequest {
  projectId: string;
  debtorId: string;
  facilityId: string[];
}

interface AddFacilityProjectResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    content: {
      bucketProcessId: string;
      id: string | null;
    };
  };
}

const useAddDataFacilityProject = (
  config?: Partial<UseMutationOptions<AddFacilityProjectResponse, Error, AddFacilityProjectRequest>>
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddFacilityProjectRequest) => {
      try {
        console.log('Adding facility project with payload:', payload);
        const response = await API('master.project.addFacility', { data: payload });
        console.log('Add Facility Project API response:', response);
        return response.data;
      } catch (error) {
        console.error('Add Facility Project API error:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Failed to add facility project:', error);
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['facility-project-customer-list']});
      console.log('Successfully added facility project:', data);
    },
    ...config,
  });

  return mutation;
};

export default useAddDataFacilityProject;
