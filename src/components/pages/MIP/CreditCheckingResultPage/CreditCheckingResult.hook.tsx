import { useContext } from 'react';

import { useParams } from 'next/navigation';

import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';

import { CreditCheckingContext } from './CreditCheckingResult.context';


const useManagementShareholderHook = () => {
  const { processId } = useParams();
  const [state] = useApp();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);

  return {
    activeTab,
    bucketMasterId: debtorInfoData?.bucketMasterId,
    setActiveTab,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
  };
};
export default useManagementShareholderHook;
