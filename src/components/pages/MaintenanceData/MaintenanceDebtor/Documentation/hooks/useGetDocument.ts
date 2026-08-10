import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoListDebtorDocumentRequestDto } from '@/services/openapi/bucket-document-service';


const useGetDocument = (
  payload: GenericBucketRequestDtoListDebtorDocumentRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await API('bucketDocument.document.documentList', {
          data: payload,
          method: 'post',
        });
        return res?.data;
      },
      queryKey: [
        'maintenance-document-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetDocument;
