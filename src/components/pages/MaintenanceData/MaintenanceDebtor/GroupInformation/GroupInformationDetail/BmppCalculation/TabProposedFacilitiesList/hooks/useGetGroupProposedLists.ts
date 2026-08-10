import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketResponseDtoDebtorGroupDto,
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BmppMonitoringControllerApi();

type PayloadProps = {
  allProduct?: Array<{[key: PropertyKey]: any}>;
  group?: BaseResponseGenericBucketResponseDtoDebtorGroupDto[];
  itemPerPage?: number;
  pages?: number[];
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto;
}

const useGetGroupProposedLists = (
  payload: PayloadProps,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQueries({
    queries: payload.group.map((group, index) => ({
      cacheTime: 0,
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const itemPerPage = payload.itemPerPage;
        const noPage = payload.pages[index];

        payload.payload.filter = {
          ...payload.payload.filter,
          allProduct: payload.allProduct?.length ? true : false,
          groupId: group?.groupCode };

        payload.payload.page = {
          itemPerPage: itemPerPage,
          noPage: noPage,
        };

        const res = await api.getFinancingFacilityProposal1(payload.payload);
        return { ...res.data.data, group: group };
      },
      queryKey: ['proposed-group-financing-facility',
        `${group.groupCode} + ${payload.pages[index]}`,
        payload.allProduct?.length,
        payload.itemPerPage],
      ...config,
    })
    ),
  });

  return query;
};

export default useGetGroupProposedLists;
