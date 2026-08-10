import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useParameterGroupStandaloneSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await API('parameter.parameterGroup.standaloneSave', {
        data: {
          id: id,
        },
      });

      return res.data?.data;
    },
    onError: (error) => {
      console.error('Error saving parameter group:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameter-group', 'list']});
    },
  });
};

export default useParameterGroupStandaloneSave;
