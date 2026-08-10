import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetConfirmationHistory from '@/hooks/services/useGetConfirmationHistory';
import useSaveConfirmationHistory from '@/hooks/services/useSaveConfirmationHistory';


const useConfirmationHistory = () => {
  const { processId } = useParams();

  const { data: confirmationResult } = useGetConfirmationHistory({
    bucketProcessId: String(processId),
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  }, {
    enabled: processId && processId !== null,
  });

  const { mutate: saveConfirmationHistory, isPending: isLoading } = useSaveConfirmationHistory({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });

    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleConfirmHistory = (selectedResponse: boolean) => {
    saveConfirmationHistory({
      id: confirmationResult?.id,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
      selectedResponse,
    });
  };

  return {
    confirmationResult,
    handleConfirmHistory,
    isLoading,
  };
};

export default useConfirmationHistory;
