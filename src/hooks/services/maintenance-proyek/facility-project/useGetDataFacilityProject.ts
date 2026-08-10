import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CustomerFacilityRequest {
  page: {
    noPage: number;
    itemPerPage: number;
  };
  sortList: {
    columnName?: string | null;
    sortType?: string | null;
  };
  searchDetail: {
    key: string;
    value: string;
  };
  filter: {
    bucketProcessId?: string | null;
    projectCode?: string | null;
    products?: any[] | null;
    status?: any[] | null;
    debtorId?: string | null;
  };
}

const useGetDataFacilityProject = (
  payload: CustomerFacilityRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Getting facility project data with payload:', payload);
        const response = await API('master.project.customerFacility', { data: payload });
        console.log('Facility Project API response:', response);
        return response.data;
      } catch (error) {
        console.error('Facility Project API error:', error);
        throw error;
      }
    },
    queryKey: ['facility-project-customer-list', payload],
    ...config,
  });

  return query;
};

export default useGetDataFacilityProject;
