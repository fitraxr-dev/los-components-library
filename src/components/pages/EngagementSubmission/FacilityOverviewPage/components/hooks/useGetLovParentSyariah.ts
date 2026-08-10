import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface GetLovParentSyariahOptions {
  enabled?: boolean;
  debtorId?: string;
}

const useGetLovParentSyariah = ({ enabled = true, debtorId }: GetLovParentSyariahOptions) => {
  return useQuery({
    enabled: enabled && !!debtorId,
    placeholderData: [],
    queryFn: async () => {
      const response = await API('master.facilityManagementSyariahExisiting.getLovParentSyariah', {
        data: { debtorId },
      });
      const content = response?.data?.data || [];

      return content.map((item: any) => ({
        label: item.parentSyariahLimitId,
        value: item.id,
      }));
    },
    queryKey: ['lov-parent-syariah'],
  });
};

export default useGetLovParentSyariah;
