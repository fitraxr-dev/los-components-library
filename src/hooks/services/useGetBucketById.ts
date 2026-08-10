import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { BucketResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketById = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    // enabled: Object.values(payload).every((value) => !!value),
    initialData: {
      aging: null,
      analystId: null,
      analystName: null,
      bucketParentId: null,
      bucketProcessId: null,
      cif: null,
      createdAt: null,
      currency: null,
      dataSource: null,
      dataSourceLabel: null,
      debtorId: null,
      debtorName: null,
      division: null,
      divisionId: null,
      dueDate: null,
      financeType: null,
      financeTypeLabel: null,
      gamId: null,
      gamName: null,
      groupId: null,
      groupName: null,
      institutionType: null,
      institutionTypeLabel: null,
      isNewClient: null,
      module: null,
      npwp: null,
      pic: null,
      process: null,
      referenceDocument: null,
      referenceDocumentDate: null,
      remarks: null,
      staffId: null,
      staffName: null,
      status: null,
      statusLabel: null,
      totalPlafon: null,
      totalProposal: null,
      typeProcess: null,
      typeProcessLabel: null,
      typeSubmission: null,
      typeSubmissionLabel: null,
    },

    queryFn: async () => {
      const res = await API('bucket.detail.byId', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['bucket', payload],
    ...config,
  });

  return query;
};

export default useGetBucketById;
