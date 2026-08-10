import { API } from '@/helpers/api';


export interface FinancingFacilityExistingRequest {
  filter: {
    debtorId: string;
    [key: string]: any;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: string;
  sortList?: string;
}

export interface FinancingFacilityExistingResponse {
  contents: Array<{
    id: string;
    facilityId: string;
    [key: string]: any;
  }>;
  page: {
    totalPage: number;
    [key: string]: any;
  };
  [key: string]: any;
}

const getFinancingFacilityExisting = async (
  payload: FinancingFacilityExistingRequest
): Promise<FinancingFacilityExistingResponse> => {
  try {
    const response = await API('bucket.financialFacility.existLos', { data: payload });
    return response.data.data; // Return the actual data from response.data.data
  } catch (error) {
    throw error;
  }
};

export default getFinancingFacilityExisting;
