import { useQuery } from '@tanstack/react-query';

import { DocumentDebtorRemarkControllerApi } from '@/services/openapi/mip-service';

import type {
  DocumentDebtorRemarkResponseDto,
  GenericSingleDtoDocumentDebtorRemarkResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentDebtorRemarkControllerApi();

type PartialDetailDebtorRemark = RequestByProcessIdDtoString & {
  bucketIdMaster?: string;
}

type ResponseDetailDebtorRemark = {
  data: DocumentDebtorRemarkResponseDto;
  isDebtorDocTypeDiff?: boolean;
  documentDebtorTypeMaster?: string;

}

const useGetDetailDebtorDocumentRemark = (

  payload: PartialDetailDebtorRemark,
  config?: Partial<UseQueryOptions<ResponseDetailDebtorRemark>>
) => {
  const query = useQuery({
    gcTime: 0,
    queryFn: async () => {
      let isDebtorDocTypeDiff = false;
      let documentDebtorTypeMaster = '';
      const { bucketIdMaster, bucketProcessId, module, process } = payload;
      const res = await api.getDetailDocumentDebtorRemark({
        bucketProcessId,
        module,
        process,
      });
      const data = res?.data?.data?.content;
      if (payload?.bucketProcessId?.split('-')[0] === 'APDP' && Boolean(payload?.bucketIdMaster?.length)) {
        const resMaster = await api.getDetailDocumentDebtorRemark({
          bucketProcessId: bucketIdMaster,
          module,
          process,
        });
        const debtorDocType = resMaster.data?.data?.content?.documentDebtorType;
        if (debtorDocType !== data?.documentDebtorType) {
          isDebtorDocTypeDiff = true;
          documentDebtorTypeMaster = debtorDocType;
        }
      }
      return {
        data,
        documentDebtorTypeMaster,
        isDebtorDocTypeDiff,
      };
    },
    queryKey: ['debtor-document-remark', payload],
    staleTime: 0,
    ...config,
  });

  return query;
};

export default useGetDetailDebtorDocumentRemark;
