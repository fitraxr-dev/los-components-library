import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type {
  FinancingFacilityMappingListRequestDto,
  FinancingFacilityMappingResponseDto,
  GenericBucketRequestDtoRequestByProcessIdDtoString,
  ListFinancingFacilityResponseDto,
} from '../FacilityOverview.type';


const useGetListFinancingCombine = (
  payloadBucket: GenericBucketRequestDtoRequestByProcessIdDtoString,
  payloadAgreement: FinancingFacilityMappingListRequestDto
) => {
  const query = useQueries({
    combine: (results) => {
      const [bucketData, agreementData] = results;

      const facilityList: ListFinancingFacilityResponseDto[] = bucketData?.data?.contents ?? [];
      const facilityPage = bucketData?.data?.page;
      const mappingPkFacilityList: FinancingFacilityMappingResponseDto[] = agreementData?.data ?? [];

      const updatedFacilityListContents = facilityList.map((facility) => {
        const matchingMapping = mappingPkFacilityList.find(
          (mapping) => mapping.facilityId === facility.facilityId
        );
        if (matchingMapping) {
          return {
            ...facility,
            pkName: matchingMapping.pkName
              ? matchingMapping.pkName.replace(/-\d+$/, '')
              : null,
          };
        }
        return {
          ...facility,
          pkName: null,
        };
      });


      // const filterPkNameHasValue = updatedFacilityListContents.filter((item) => item.pkName !== null);
      const filterPkNameHasValue = updatedFacilityListContents; // Sementara bypass filter


      return {
        data: filterPkNameHasValue,
        page: facilityPage,
        pending: results.some((result) => result.isPending),
      };
    },
    queries: [
      {
        queryFn: async () => {
          try {
            const response = await API('bucket.financialFacility.list', {
              data: payloadBucket,
            });
            return response.data.data;
          } catch (error) {
            console.error('Error fetching bucket data:', error);
            throw new Error('Failed to fetch bucket data');
          }
        },
        queryKey: ['bucket-financing-facility', payloadBucket],
        staleTime: ONE_MINUTE,
      },
      {
        placeholderData: keepPreviousData,
        queryFn: async () => {
          try {
            const response = await API('agreement.financingFacilityMapping.list', {
              data: payloadAgreement,
            });
            return response.data.data.contents;
          } catch (error) {
            console.error('Error fetching agreement data:', error);
            throw new Error('Failed to fetch agreement data');
          }
        },
        queryKey: ['agreement-mapping-financing-facility', payloadAgreement],
        staleTime: ONE_MINUTE,
      },
    ],
  });

  return query;
};

export default useGetListFinancingCombine;
