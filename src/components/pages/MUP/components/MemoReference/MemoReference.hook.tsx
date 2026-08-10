import { useEffect } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';

import useGetBucketByBcm from './hooks/useGetBucketByBcm';
import useGetMemoReference from './hooks/useGetMemoReference';

import type { MemoReferenceProps } from './MemoReference.type';


const useMemoReference = (props: MemoReferenceProps) => {
  const { bucketProcessId, module, process } = props;


  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: bucketProcessId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  }, { enabled: bucketProcessId ? true : false });

  const { data: bcmData } = useGetBucketByBcm({
    bcmId: debtorInfoData?.bucketMaster,
    module,
    process,
  });
  const { data: documentData } = useGetMemoReference({
    bucketProcessId: bcmData?.bucketProcessId,
    module,
    process,
  });

  return {
    documentData,
  };
};

export default useMemoReference;
