import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface GetMaintenanceProjectDetailPayload {
  id: string;
}

interface MaintenanceProjectDetailResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    content: {
      bucketProcessId: string;
      id: string;
      projectInformation: {
        name: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        description: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        sector: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        startDate: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        endDate: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        exchangeRate: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        valueInIdr: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        value: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        classification: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        category: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        output: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        outputUnit: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        projectAddress: {
          address: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          province: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          city: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          district: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          village: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          postalCode: {
            value: string;
            updated: boolean;
            previousValue: string | null;
          };
          dataAsOf: string;
        };
        modifiedBy: string;
        modifiedDate: string;
      };
      otherInformation: {
        programSourceOfFund: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        projectSourceOfFund: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        valueSourceOfFund: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        physicalRealization: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        others: {
          value: string | null;
          updated: boolean;
          previousValue: string | null;
        };
        exchangeRateSourceOfFund: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        valueInIdr: {
          value: {
            currency: string;
            value: number;
          };
          updated: boolean;
          previousValue: any | null;
        };
        remarkSourceOfFund: {
          value: string;
          updated: boolean;
          previousValue: string | null;
        };
        physicalRealizationOthers: {
          value: string | null;
          updated: boolean;
          previousValue: string | null;
        };
        dataAsOf: string;
        modifiedBy: string;
        modifiedDate: string;
      };
      owner: any | null;
      contractor: any | null;
    };
  };
}

interface UseGetMaintenanceProyekDetailOptions {
  enabled?: boolean;
}

const useGetMaintenanceProyekDetail = (
  payload: GetMaintenanceProjectDetailPayload,
  options?: UseGetMaintenanceProyekDetailOptions
) => {
  const query = useQuery({
    enabled: !!payload?.id && (options?.enabled !== false),
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<MaintenanceProjectDetailResponse> => {
      try {
        // console.log('Getting maintenance project detail with payload:', payload);
        const response = await API('master.project.detail', { data: payload });
        // console.log('Maintenance Project Detail API response:', response);
        return response.data;
      } catch (error) {
        // console.error('Maintenance Project Detail API error:', error);
        throw error;
      }
    },
    queryKey: [
      'maintenance-proyek-detail',
      payload.id
    ],
  });

  return query;
};

export default useGetMaintenanceProyekDetail;
