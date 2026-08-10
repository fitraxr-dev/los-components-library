import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SaveParentLimitPayload {
  bucketProcessId: string;
  tracerId?: string;
  facilityId?: string;
  pipelineId: string;
  currencyOrderValue: string;
  orderValue: number;
  plafondCash: number;
  activationDate: string;
  maturityDate: string;
  facilityCreatedDate: string;
  reviewFrequency: string;
  cifGroup: string;
  onlineFacilityValue: number;
  osPrincipal: number;
  drawDownFlexibility: number;
  bmpkFlag: string;
  notes: string;
  availableMarker: string;
  countryOfRisk: string;
  countryPercent: number;
  onlineUpdate: string;
  coBook: string;
  cifParent?: string;
  bmppNotes: string;
  plafondBefore: number;
  projectLocate: string;
  newExtend: number;
  creditCategory: string;
  typeOfUse: string;
  usageOrientation: string;
  loanCharc: string;
  parentLimitType?: string;
  parentSyariahLimitIdTemenos?: string;
}

interface SaveParentLimitResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    content: {
      id: number;
      bucketProcessId: string;
      idFacility: number;
      tracerId: string;
      parentSyariahLimitId: number | null;
      childSyariahLimitId: number | null;
      pipelineId: string;
      cifGroup: string;
      reviewFrequency: string;
      bmpkFlag: string;
      bmppNotes: string;
      notes: string;
      availableMarker: string;
      countryOfRisk: string;
      countryPercent: number;
      onlineUpdate: string;
      coBook: string;
      cif?: string;
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
      orderValue: number;
      totalOrderValue: number | null;
      process: string;
      module: string;
      plafondCash: number;
      osPrincipal: number;
      drawDownFlexibility: number;
      cifParent: string | null;
      activationDate: string;
      maturityDate: string;
      facilityCreateDate: string;
    };
  };
}

interface UseSaveParentLimitOptions {
  onSuccess?: (data: SaveParentLimitResponse) => void;
  onError?: (error: any) => void;
}

const useSaveParentLimit = (options?: UseSaveParentLimitOptions) => {
  const mutation = useMutation({
    mutationFn: async (payload: SaveParentLimitPayload) => {
      const res = await API('bucket.facilitySyariah.save', { data: payload });
      return res.data as SaveParentLimitResponse;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useSaveParentLimit;
