import { useMutation } from '@tanstack/react-query';

import { SimulationBmppControllerApi, type BmppDetailRequestDto } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useBmppSimulationCalculate = () => {
  return useMutation({
    mutationFn: async (payload: BmppDetailRequestDto) => {
      const res = await api.calculateBmpp(payload);
      return res?.data;
    },
  });
};

export default useBmppSimulationCalculate;
