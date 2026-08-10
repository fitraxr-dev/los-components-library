import { useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new DocumentControllerApi();

const useGetDocumentGroupDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailDocumentGroup(payload);
      return res?.data?.data;
    },
    queryKey: ['detail-document-group-rating', payload],
  });

  return query;
};


export default useGetDocumentGroupDetail;
