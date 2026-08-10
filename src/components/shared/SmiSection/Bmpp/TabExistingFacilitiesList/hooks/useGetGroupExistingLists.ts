import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketResponseDtoDebtorGroupDto,
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new SimulationBmppControllerApi();

type PayloadProps = {
  allProduct?: Array<{[key: PropertyKey]: any}>;
  group?: BaseResponseGenericBucketResponseDtoDebtorGroupDto[];
  itemPerPage?: number;
  pages?: number[];
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto;
}

const useGetGroupExistingLists = (
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
          groupId: group?.id };

        payload.payload.page = {
          itemPerPage,
          noPage,
        };

        const res = await api.getFinancingFacilityExisting(payload.payload);
        return { ...res.data.data, group: group };
      },
      queryKey: ['existing-group-financing-facility',
        `${group.id} + ${payload.pages[index]}`,
        payload.allProduct?.length],
      ...config,
    })
    ),
  });

  return query;
};

export default useGetGroupExistingLists;
