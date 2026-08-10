import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDetailBucketDebtor = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.module && !!payload?.process,
    initialData: {
      analystId: null,
      analystName: null,
      bucketMasterId: null,
      bucketProcessId: null,
      cif: null,
      coBorrower: null,
      contactPerson: null,
      debtorId: null,
      debtorName: null,
      description: null,
      divisionName: null,
      gamId: null,
      gamName: null,
      groupName: null,
      institutionType: null,
      isAffiliate: null,
      isExisting: null,
      isGroup: false,
      isRelatedToSmi: false,
      isRelation: true,
      managementRemark: null,
      position: null,
      positionId: null,
      proposalDate: null,
      relationshipSince: null,
      sectorName: null,
      shareholderRemark: null,
      staffName: null,
      syndication: null,
      typeFinancing: null,
      typeProcess: null,
      typeProposal: null,
      yearFounded: null,
    },
    queryFn: async () => {
      try {
        console.log('Calling API detail-bucket-debtor with payload:', payload);
        const response = await API('bucket.debtor.detail', { data: payload });
        console.log('API response (detail-bucket-debtor):', response);

        return response.data.data.content;
      } catch (error) {
        console.error('API error (detail-bucket-debtor):', error);
        throw error;
      }
    },
    queryKey: ['detail-bucket-debtor', payload],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    ...config,
  });

  return query;
};

export default useGetDetailBucketDebtor;
