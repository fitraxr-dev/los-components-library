import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { FIVE_SECONDS, ONE_MINUTE } from '@/configs/constants';
import { TodoControllerApi } from '@/services/openapi/dashboard-service';

import type { GenericBucketRequestDtoToDoRequestDto } from '@/services/openapi/dashboard-service';


const api = new TodoControllerApi();

const useGetTodoList = (payload: GenericBucketRequestDtoToDoRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketTodo(payload);

      return res.data;
    },
    queryKey: ['todolist', payload],
    refetchInterval: FIVE_SECONDS,
    select: ({ data }) => data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetTodoList;
