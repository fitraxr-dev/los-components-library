import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SyariahFacilityResponse {
  contents: Array<{
    id: number;
    bucketProcessId: string;
    idFacility: number;
    tracerId: string;
    parentSyariahLimitId: number | null;
    childSyariahLimitId: number | null;
    pipelineId: string;
    cifGroup: string;
    reviewFrequency: string;
    facilityId: Array<string>;
    coreFacilityId: string | null;
    process: string;
    module: string;
    orderValue: number | null;
    totalOrderValue: number;
    plafondCash: number | null;
    activationDate: string | null;
    maturityDate: string | null;
    currencyOrderValue: string;
  }>;
  page: {
    noPage: number;
    itemPerPage: number;
    totalPage: number;
    totalData: number;
  };
}

interface SyariahFacilityPayload {
  filter: {
    bucketProcessId: string;
    module: string;
    process: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

const useGetListSyariahFacility = (payload: SyariahFacilityPayload, enabled?: boolean) => {
  const query = useQuery({
    enabled: enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.facilitySyariah.list', { data: payload });
      return res.data.data as SyariahFacilityResponse;
    },
    queryKey: ['syariah-facility-list', payload],
  });

  return query;
};

export default useGetListSyariahFacility;
