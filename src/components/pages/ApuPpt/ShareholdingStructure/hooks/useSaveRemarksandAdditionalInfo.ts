import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { RemarksandAdditionalInfoRequestDto } from './remarksandAdditionalInfo.constant';


const api = new ShareholderStructureControllerApi();

const useSaveRemarksAndAdditional = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RemarksandAdditionalInfoRequestDto) => {

      const {
        bucketProcessId,
        process,
        module,
        debtorId,
        remark,
        description,
      } = payload;
      const res = await api.saveShareholderStructureRemark(
        bucketProcessId,
        process,
        module,
        debtorId,
        remark,
        description,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apuppt-shareholding-structure-remark']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});

      onSuccess();
    },

  });

  return mutation;
};


export default useSaveRemarksAndAdditional;
