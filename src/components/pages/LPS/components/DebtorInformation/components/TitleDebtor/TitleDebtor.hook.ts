import { maintenanceDebtor, mip } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useIdentity from '@/hooks/useIdentity';


const useTitleDebtor = (process: TypeProcess) => {
  const { processId } = useIdentity();
  const isProcessDpop = String(processId).includes('LPSBD');
  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: isProcessDpop
      ? TypeProcess.LPS_BAST_DPOP
      : process === TypeProcess.LPS_BAST ? TypeProcess.LPS_BAST : TypeProcess.LPS_CORE,
  });
  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: debtorInfoData?.debtorId !== null && debtorInfoData?.debtorId !== undefined,
  });
  const handleRouteMaintenanceDebitor = () => {
    const path = replacePath(
      maintenanceDebtor.CUSTOMER_INFORMATION_PREVIEW_PAGE,
      {
        debtorId: debtorInfoData?.debtorId,
        module: 'maintenance',
      }
    );

    window.open(path, '_blank', 'noopener, noreferrer');
  };


  return {
    handleRouteMaintenanceDebitor,
    isValidateSuccess,
    validateResult,
  };
};

export default useTitleDebtor;
