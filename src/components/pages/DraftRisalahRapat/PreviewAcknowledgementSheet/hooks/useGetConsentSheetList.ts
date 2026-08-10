import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ConsentSheetListUser {
  id?: number;
  directorateId?: string;
  directorateLabel?: string;
  staffId?: number;
  staffName?: string;
  divisionId?: string;
  divisionLabel?: string;
  jobPositionLabel?: string;
  consentRole?: string;
  consentRoleLabel?: string;
  sequence?: number;
  sku?: {
    id?: number;
    directorateId?: string;
    directorateLabel?: string;
    staffId?: number;
    staffName?: string;
    divisionId?: string;
    divisionLabel?: string;
    jobPositionLabel?: string;
    skuNo?: string;
    skuDate?: string;
  };
}

export interface ConsentSheetListDivision {
  id?: number;
  divisionName?: string;
  sequence?: number;
  isEditable?: boolean;
  listUser?: ConsentSheetListUser[];
}

interface ConsentSheetListRequest {
  bucketProcessId: string;
  from: string;
}

interface ConsentSheetListResponse {
  content: {
    listDivision: ConsentSheetListDivision[];
    bucketProcessId: string;
    module: TypeModule;
    process: TypeProcess;
  };
}

const useGetConsentSheetList = (
  payload: ConsentSheetListRequest,
  queryOptions?: Partial<UseQueryOptions<ConsentSheetListResponse, any, any>>
) => {
  const query = useQuery({
    enabled: Boolean(payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('agreement.risalahRapatConsentSheet.list', {
        data: {
          ...payload,
          module: TypeModule.RISALAH_RAPAT,
          process: TypeProcess.RISALAH_RAPAT,
        },
      });

      return res?.data?.data;
    },
    ...queryOptions,
    queryKey: ['consent-sheet-list', payload],
  });
  return query;
};

export default useGetConsentSheetList;
