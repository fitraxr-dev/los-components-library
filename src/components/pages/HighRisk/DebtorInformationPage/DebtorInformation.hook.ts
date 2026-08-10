import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';


const useDebtorInformation = () => {
  const { processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { data: bucketData, isLoading: isBucketIsLoading } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: bucketData?.debtorId,
  }, {
    enabled: !!bucketData?.debtorId,
  });

  const bucketDpop = bucketData?.relatedProcess?.find((item) => item?.includes('APDP'));

  const handleViewApuPpt = () => {
    window.open(setPreviewPage(replacePath(apuPpt.VERIFICATION_DEBTOR_INFORMATION_PAGE, { processId: bucketDpop })), '_blank');
  };

  return {
    debtorInfoData,
    handleViewApuPpt,
    isBucketIsLoading,
    isValidateSuccess,
    validateResult,
  };
};


export default useDebtorInformation;
