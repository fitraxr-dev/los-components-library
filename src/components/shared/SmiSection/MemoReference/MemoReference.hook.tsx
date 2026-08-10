import { useEffect, useState } from 'react';

import { TypeModule } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import useGetBucketByBcm from '@/hooks/services/bucket/useGetBucketByBcm';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetMemoReference from '@/hooks/services/bucket-document/document/useGetMemoReference';

import type { MemoReferenceProps } from './MemoReference.type';


const useMemoReference = (props: MemoReferenceProps) => {
  const { bucketProcessId, module, process, childProcess } = props;
  const [documentData, setDocumentData] = useState(null);

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: bucketProcessId,
    module,
    process,
  }, { enabled: bucketProcessId ? true : false });

  const { data: bcmData } = useGetBucketByBcm({
    bcmId: debtorInfoData?.bucketMaster,
    module: TypeModule.MIP_REVIEW,
    process: childProcess ? childProcess : process,
  }, { enabled: debtorInfoData?.bucketMaster ? true : false });

  const { data: document } = useGetMemoReference({
    bucketProcessId: bcmData?.bucketProcessId,
    module: TypeModule.MIP_REVIEW,
    process: childProcess ? childProcess : process,
  }, { enabled: bcmData?.bucketProcessId ? true : false });

  useEffect(() => {
    if (document) {
      const data = {
        documentDate: document.documentDate
          ? formatDate(new Date(document.documentDate), 'DD MMMM YYYY') : '-',
        documentNumber: document.documentNumber ?? '-',
        fileName: document.fileName ?? '-',
      };

      setDocumentData(data);
    }
  }, [document]);

  return {
    documentData,
  };
};

export default useMemoReference;
