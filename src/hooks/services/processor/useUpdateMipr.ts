import { useQuery, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { MipStepResponseDto } from '@/hooks/services/useGetBucketStepper.types';


interface UpdateMiprPayload {
  bucketParent: string;
}

interface UseUpdateMiprParams {
  bucketParent?: string | null;
  stepperStatus?: string | null;
  steps?: Array<MipStepResponseDto> | null;
  refetchInterval?: number;
}

const buildPayload = (bucketParent: string): UpdateMiprPayload => ({
  bucketParent,
});

const useUpdateMipr = ({
  bucketParent,
  stepperStatus,
  steps,
  refetchInterval = 5000,
}: UseUpdateMiprParams) => {
  const queryClient = useQueryClient();

  const requiredKeys = [
    'identify-legal-risks',
    'environmental-and-social-safeguard-issue',
    'sharia-compliance-aspect',
    'risk-profile',
  ];

  const requiredSteps = steps?.filter((step) =>
    requiredKeys.includes(step.key ?? '')
  ) ?? [];

  const shouldEnable =
    Boolean(bucketParent) &&
    Boolean(steps) &&
    (stepperStatus === 'MIP_REVIEW' || stepperStatus === 'REVISION_COMPLETED' || stepperStatus === 'MEMO_SUPPLEMENT_COMPLETED') &&
    (requiredSteps.length < 4 ||
    requiredSteps.some((step) => step.enable === false));

  const query = useQuery({
    enabled: shouldEnable,
    queryFn: async () => {
      if (!bucketParent) return null;

      const response = await API('processor.mip.updateMipr', {
        data: buildPayload(bucketParent),
      });

      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});

      return response?.data;
    },
    queryKey: ['update-mipr', bucketParent ?? ''],
    refetchInterval,
  });

  return {
    ...query,
    isEnabled: shouldEnable,
  };
};

export default useUpdateMipr;
