import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface MenuNameRequest {
  value: string;
}

export interface MenuNameDetail {
  menuId: string;
  menu: string;
}

const useGetAllMenuName = (
  payload: MenuNameRequest,
  config?: Partial<UseQueryOptions<{ label: string; value: string }[]>>
) => {
  const query = useQuery<{ label: string; value: string }[]>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('userManagement.lov.menuName', { data: payload });
      const result: MenuNameDetail[] = res.data.data.contents;

      return result.map((data) => ({
        id: data.menuId,
        key: data.menuId,
        label: data.menu,
        value: data.menuId,
      }));
    },
    queryKey: ['menu-name', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetAllMenuName;
