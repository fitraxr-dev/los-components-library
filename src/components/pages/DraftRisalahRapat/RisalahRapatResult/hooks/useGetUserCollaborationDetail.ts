import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatConsentSheetControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong, RisalahRapatConsentSheetUserResponseDto } from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RisalahRapatConsentSheetControllerApi();

const useGetUserCollaborationDetail = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<RisalahRapatConsentSheetUserResponseDto>>
) => {
  const query = useQuery({
    initialData: {
      consentRole: null,
      consentRoleLabel: null,
      directorateId: null,
      directorateLabel: null,
      divisionId: null,
      divisionLabel: null,
      id: null,
      jobPositionLabel: null,
      sku: null,
      staffId: null,
      staffName: null,
    },
    queryFn: async () => {
      const res = await api.detailConsentSheetUser(payload);

      return res.data.data.content;
    },
    queryKey: ['user-collaboration-detail', payload],
    ...config,
  });
  return query;
};

export default useGetUserCollaborationDetail;
