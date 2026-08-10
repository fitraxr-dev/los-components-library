import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ShareholderStructureRequestDebt {
  debtorId: string;
}

interface ShareholderStructureRequestBucket {
  bucketProcessId: string;
}

type ShareholderStructureRequest = ShareholderStructureRequestDebt | ShareholderStructureRequestBucket;

const useGetShareholderStructureList = (
  config?: Partial<UseQueryOptions<any>>
) => {
  const params = useParams();

  // Extract ID from URL params
  let extractedId = params?.id as string;

  if (!extractedId && params?.processId) {
    extractedId = params.processId as string;
  }

  if (!extractedId && params) {
    Object.values(params).forEach((value) => {
      if (typeof value === 'string' && (value.startsWith('DEBT-') || value.startsWith('MAI-'))) {
        extractedId = value;
      }
    });
  }

  let payload: ShareholderStructureRequest;
  let idType: 'debt' | 'bucket' | 'unknown' = 'unknown';

  if (extractedId) {
    if (extractedId.startsWith('DEBT-')) {
      idType = 'debt';
      payload = { debtorId: extractedId };
    } else if (extractedId.startsWith('MAI-')) {
      idType = 'bucket';
      payload = { bucketProcessId: extractedId };
    } else {
      idType = 'debt';
      payload = { debtorId: extractedId };
    }
  } else {
    payload = { debtorId: '' };
  }

  // console.log('🔍 Debug Info:');
  // console.log('- Current params:', params);
  // console.log('- params.id:', params?.id);
  // console.log('- params.processId:', params?.processId);
  // console.log('- Extracted ID:', extractedId);
  // console.log('- ID Type:', idType);
  // console.log('- Final Payload:', payload);
  // console.log('- Query enabled:', !!extractedId);

  const query = useQuery({
    enabled: !!extractedId,
    queryFn: async () => {
      try {
        const response = await API('master.shareholder.structureList', { data: payload });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['shareholders-structure-list', extractedId, idType],
    retry: false,
    ...config,
  });

  // console.log('📊 Query state:', {
  //   isLoading: query.isLoading,
  //   isError: query.isError,
  //   error: query.error,
  //   data: query.data
  // });

  return query;
};

export default useGetShareholderStructureList;
