import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DebtorInformationDetailDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDetailBucketDebtor = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<DebtorInformationDetailDto>>
) => {
  const query = useQuery({
    enabled: !!payload.bucketProcessId && !!payload.module && !!payload.process,
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
      infrastructureSectorOther: null,
      institutionType: null,
      institutionTypeLabel: null,
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
      const res = await API('bucket.debtor.detail', {
        data: payload,
      });

      const content = res.data.data.content;

      return content;
    },
    queryKey: ['detail-bucket-debtor', payload],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    ...config,
  });

  return query;
};

export default useGetDetailBucketDebtor;
