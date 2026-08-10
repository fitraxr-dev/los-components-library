import { useMutation } from '@tanstack/react-query';

import {
  saveBusinessSummary,
  type SaveBusinessSummaryRequest,
  type SaveBusinessSummaryResponse,
} from './constant/saveBusinessSummary';


const useSaveBusinessSummary = () => {
  const mutation = useMutation<SaveBusinessSummaryResponse, Error, SaveBusinessSummaryRequest>({
    mutationFn: async (payload: SaveBusinessSummaryRequest) => {
      return await saveBusinessSummary(payload);
    },
    onError: (error) => {
      console.error('Error saving Business Summary:', error);
    },
    onSuccess: (data) => {
    },
  });

  return mutation;
};

export default useSaveBusinessSummary;
