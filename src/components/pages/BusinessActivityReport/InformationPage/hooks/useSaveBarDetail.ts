import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';
import { BarControllerApi } from '@/services/openapi/master-service';

import type { DebtorInformationDataRequestDto } from '@/services/openapi/bucket-service';
import type { BarInformationRequestDto } from '@/services/openapi/master-service';


const barAPI = new BarControllerApi();

const bucketAPI = new BucketControllerApi();

type PayloadProps = {
  barPayload: BarInformationRequestDto;
  debtorPayload: DebtorInformationDataRequestDto;
}
const useSaveBarDetail = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ barPayload, debtorPayload }: PayloadProps) => {
      const bar = await barAPI.saveBarInformation(barPayload);

      const debtor = await bucketAPI.saveBucketDebtor(debtorPayload);

    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bar-detail']});
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBarDetail;
