import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SyariahFacilityDetailResponse {
  contents: Array<{
    id: number;
    bucketProcessId: string;
    idFacility: number;
    tracerId: string;
    idLimit: string;
    parentSyariahLimitId: number | null;
    childSyariahLimitId: number | null;
    childLimit: any[];
    pipelineId: string;
    cifGroup: string;
    onlineFacilityValue: number;
    reviewFrequency: string;
    bmpkFlag: string;
    bmppNotes: string;
    notes: string;
    availableMarker: string;
    countryOfRisk: string;
    countryPercent: number;
    onlineUpdate: string;
    coBook: string;
    plafondBefore: number;
    projectLocate: string;
    newExtend: number;
    creditCategory: string;
    typeOfUse: string;
    usageOrientation: string;
    loanCharc: string;
    facilityId: string;
    coreFacilityId: string | null;
    currencyOrderValue: string;
    orderValue: number | null;
    totalOrderValue: number;
    plafondCash: number | null;
    osPrincipal: number;
    drawDownFlexibility: number;
    cifParent: string | null;
    activationDate: string | null;
    maturityDate: string | null;
    facilityCreateDate: string | null;
    process: string;
    module: string;
    parentSyariahLimitIdExisting: string | null;
  }>;
  page: null;
}

interface SyariahFacilityDetailPayload {
  filter: {
    bucketProcessId: string;
    parentSyariahLimitId?: string;
    facilityId?: string;
    module?: string;
    process?: string;
  };
}

const useGetDetailSyariahFacility = (payload: SyariahFacilityDetailPayload, enabled?: boolean) => {
  const query = useQuery({
    enabled,
    queryFn: async () => {
      const res = await API('bucket.facilitySyariah.detail', { data: payload });
      return res.data.data as SyariahFacilityDetailResponse;
    },
    queryKey: ['syariah-facility-detail', payload],
  });

  return query;
};

export default useGetDetailSyariahFacility;
