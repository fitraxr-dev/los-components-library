import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';
import { BucketControllerApi } from '@/services/openapi/bucket-service';
import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const apiBucket = new BucketControllerApi();
const apiAgreement = new RisalahRapatCommitteeMeetingInformationControllerApi();
const apiMip = new DebtorProfileInformationControllerApi();

const useGetMeetingDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        // 1. Fetch meeting detail
        const meetingRes = await apiAgreement.getDetailCommitteeMeetingInformation(payload);
        const meetingData = meetingRes.data.data.content;

        // 2. Fetch bucket detail
        const bucketRes = await apiBucket.getBucketDetail(payload);
        const bucketData = bucketRes.data.data.content;

        // 3. Find AP- process from relatedProcess
        const relatedProcess = bucketData?.relatedProcess || [];
        const apProcess = relatedProcess.find((process: string) =>
          process.startsWith('AP-')
        );

        let businessField = '';

        // 4. Fetch debtor profile if AP- process exists
        if (apProcess) {
          try {
            const debtorProfileRes = await apiMip.getDetailDebtorProfileInformation({
              bucketProcessId: apProcess,
              module: 'APU_PPT',
              process: 'APU_PPT',
            });
            businessField = debtorProfileRes?.data?.data?.content?.businessField || '';
          } catch (error) {
            console.warn('Failed to fetch debtor profile, using fallback:', error);
          }
        }

        return {
          ...meetingData,
          bucketParentId: bucketData?.bucketParentId,
          debtorCode: bucketData?.debtorId,
          debtorName: bucketData?.debtorName,
          noMup: bucketData?.parentMemoNo,
          sector: businessField,
          sectorLabel: businessField,
        };
      } catch (error) {
        console.error('Error in useGetMeetingDetail:', error);
        throw error;
      }
    },
    queryKey: ['meeting-detail-complete', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMeetingDetail;
