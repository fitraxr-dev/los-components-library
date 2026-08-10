import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketById = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
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
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('bucket.detail.byId', { data: payload });
        console.log('API response:', response);
        return response.data.data.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['bucket', payload],
    ...config,
  });

  return query;
};

export default useGetBucketById;
