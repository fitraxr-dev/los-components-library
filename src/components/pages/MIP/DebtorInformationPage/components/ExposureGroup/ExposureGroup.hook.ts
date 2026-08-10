import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGetExposureGroup from '@/hooks/services/bucket/debtor/useGetExposureGroup';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';


const useExposureGroup = () => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: exposureGroupData } = useGetExposureGroup({
    bucketProcessId: processId,
    debtorId: debtorInfoData?.debtorId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  return {
    exposureGroupData,
  };
};

export default useExposureGroup;
