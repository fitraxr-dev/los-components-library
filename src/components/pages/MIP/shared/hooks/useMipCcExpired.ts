import { useQuery } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { MipStepResponseDto } from '@/hooks/services/useGetBucketStepper.types';


const FINISHED_STATES = ['COMPLETED', 'CANCELED', 'REJECTED'];
const REVISION_STATES = [
  'REVISION',
  'REVISION_WAITING_TL',
  'REVISION_WAITING_KADIV',
  'REVISION_RETURN_STAFF',
  'REVISION_RETURN_TL',
];

interface UpdateCcExpiredPayload {
  id: string;
}

interface UseMipCcExpiredParams {
  bucketMasterId?: string | null;
  module?: TypeModule | string | null;
  process?: TypeProcess | string | null;
  stepperStatus?: string | null;
  steps?: Array<MipStepResponseDto> | null;
  refetchInterval?: number;
}

const buildPayload = (bucketMasterId: string): UpdateCcExpiredPayload => ({
  id: bucketMasterId,
});

const useMipCcExpired = ({
  bucketMasterId,
  module,
  process,
  stepperStatus,
  steps,
  refetchInterval = 5000,
}: UseMipCcExpiredParams) => {
  const isMipProcessScreen =
    (module ?? '') === TypeModule.MIP || (process ?? '') === TypeProcess.MIP;

  const isMipReviewProcessScreen =
    (module ?? '') === TypeModule.MIP_REVIEW || (process ?? '') === TypeProcess.MIP_REVIEW;

  const isMipOrMipReviewScreen = isMipProcessScreen || isMipReviewProcessScreen;

  const hasCreditCheckingCompleted = steps?.some(
    (step) => step?.key === 'credit-checking-result' && step?.isDone,
  );

  const isStepperFinalState = FINISHED_STATES.includes(stepperStatus ?? '');

  const isMipReviewInRevisionState = isMipReviewProcessScreen &&
    REVISION_STATES.includes(stepperStatus ?? '');

  const shouldEnable =
    Boolean(bucketMasterId) &&
    isMipOrMipReviewScreen &&
    Boolean(hasCreditCheckingCompleted) &&
    !isStepperFinalState &&
    (isMipProcessScreen || isMipReviewInRevisionState);

  const query = useQuery({
    enabled: shouldEnable,
    queryFn: async () => {
      if (!bucketMasterId) return null;

      const response = await API('processor.mip.ccExpired', {
        data: buildPayload(bucketMasterId),
      });

      return response?.data?.data?.content;
    },
    queryKey: ['cc-expired', bucketMasterId ?? ''],
    refetchInterval,
  });

  return {
    ...query,
    isEnabled: shouldEnable,
  };
};

export default useMipCcExpired;
