import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { RatingControllerApi } from '@/services/openapi/mip-service';


type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  rating: string;
  category: string;
  ratingType: string;
  ratingPeriod: string;
  ratingRemark: string;
  supportingFactor: Blob;
  constrainingFactor: Blob;
  note: Blob;
}

const api = new RatingControllerApi();

const useSaveRating = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      rating,
      category,
      ratingType,
      ratingPeriod,
      ratingRemark,
      supportingFactor,
      constrainingFactor,
      note,
    }: SaveDto) => {
      const res = await API('mip.rating.save', { data: {
        bucketProcessId,
        category,
        constrainingFactor,
        module,
        note,
        process,
        rating,
        ratingPeriod,
        ratingRemark,
        ratingType,
        supportingFactor,
      }, headers: {
        'Content-Type': 'multipart/form-data',
      } });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['mip-rating']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-proposal-detail', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveRating;
