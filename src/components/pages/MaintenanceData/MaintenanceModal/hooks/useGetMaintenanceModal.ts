import { useQuery } from '@tanstack/react-query';

import { MaintenanceCapitalControllerApi } from '@/services/openapi/master-service';


const api = new MaintenanceCapitalControllerApi();

const useGetMaintenanceModal = (
  payload?: any,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getCurrentCapital(payload);

      return res.data.data.content;
    },
    queryKey: ['get-capital-detail'],
  });

  return query;
};

export default useGetMaintenanceModal;
