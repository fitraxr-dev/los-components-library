import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface AgentValues {
  agentId?: string | number;
  agentType?: string;
  agentLabel?: string;
  isEditable?: boolean;
};

interface BankInformationValues {
  bankInformationId?: string | number;
  isEditable?: boolean;
  amount?: number;
  bankName?: string;
}

const useSaveSyndicationTab = ({
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityManagementSyariahExisiting.saveSyndication', {
        data: payload,
      });

      return res.data?.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['syariah-child-limit-syndication']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};
export default useSaveSyndicationTab;
