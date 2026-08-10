import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ProcessItem {
  value: string;
  label: string;
}

const useGetParameterSLAProcessList = () => {
  const query = useQuery<ProcessItem[]>({
    placeholderData: [],
    queryFn: async () => {
      const res = await API('parameter.parameterSla.lovProcess', {
        data: {},
      });

      const contents = res.data?.data?.contents ?? [];

      return contents.map((item: { key: string; label: string }) => ({
        label: item.label,
        value: item.key,
      }));
    },
    queryKey: ['parameter-sla-process-list'],
  });
  return query;
};

export default useGetParameterSLAProcessList;
