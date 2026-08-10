import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';
import { FinancingFacilityControllerApi } from '@/services/openapi/agreement-service';
import { BucketControllerApi } from '@/services/openapi/bucket-service';


const useGetListFinancingPk = (
  payloadBucket: any,
  payloadAgreement: any,
  currentBucketProcessId?: string,
  editPKMonitoring?: boolean,
  staleTime?: number
) => {

  const query = useQueries({
    combine: (results) => {
      const [bucketData, agreementData] = results;

      const facilityList: any[] = bucketData?.data?.contents ?? [];
      const facilityPage = bucketData?.data?.page;
      const mappingPkFacilityList: any[] = agreementData?.data ?? [];

      const updatedFacilityListContents = facilityList
        .map((facility) => {
          const matchingMapping = mappingPkFacilityList.find(
            (mapping) => mapping.facilityId === facility.facilityId
          );

          if (matchingMapping) {
            return {
              ...facility,
              bucketProcessIdMapping: matchingMapping.bucketProcessId,
              pkName: matchingMapping.pkName
                ? matchingMapping.pkName.replace(/-\d+$/, '')
                : null,
            };
          }

          if (!editPKMonitoring) {
            return {
              ...facility,
              bucketProcessIdMapping: null,
              pkName: null,
            };
          }

        })
        .filter((facility) => {
          if (!currentBucketProcessId) {
            return true;
          }

          if (!facility?.bucketProcessIdMapping) {
            return true;
          }

          if (facility?.bucketProcessIdMapping === currentBucketProcessId) {
            return true;
          }

          return false;
        });

      return {
        data: updatedFacilityListContents,
        isSucces: results.some((res) => res?.isSuccess),
        page: facilityPage,
        pending: results.some((result) => result.isPending),
      };
    },
    queries: [
      {
        queryFn: async () => {
          try {
            const response = await API('bucket.financialFacility.list', { data: payloadBucket });
            return response.data.data;
          } catch (error) {
            console.error('Error fetching bucket data:', error);
            throw new Error('Failed to fetch bucket data');
          }
        },
        queryKey: ['bucket-financing-facility', payloadBucket, editPKMonitoring],
        staleTime: staleTime ?? ONE_MINUTE,
      },
      {
        placeholderData: keepPreviousData,
        queryFn: async () => {
          try {
            const response = await API('agreement.financingFacilityMapping.list', { data: payloadAgreement });
            return response.data.data.contents;
          } catch (error) {
            console.error('Error fetching agreement data:', error);
            throw new Error('Failed to fetch agreement data');
          }
        },
        queryKey: ['agreement-mapping-financing-facility', payloadAgreement, editPKMonitoring],
        staleTime: staleTime ?? ONE_MINUTE,
      },
    ],
  });

  return query;
};

export default useGetListFinancingPk;
