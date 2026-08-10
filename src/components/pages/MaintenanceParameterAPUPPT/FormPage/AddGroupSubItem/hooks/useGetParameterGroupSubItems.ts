import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SubItemListParams {
  bucketProcessId: string | null;
  id: string | null;
  page: number;
  pageSize: number;
  filter?: any;
}

const useGetParameterGroupSubItems = (params: SubItemListParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.subItemList', {
        data: {
          filter: {
            ...params?.filter?.filter,
            bucketProcessId: params?.bucketProcessId === 'null' ? null : params?.bucketProcessId,
            id: params?.id || null,
          },
          page: {
            itemPerPage: params.pageSize,
            noPage: params.page,
          },
          searchDetail: {
            key: params?.filter?.searchDetail?.key || '',
            value: params?.filter?.searchDetail?.value || '',
          },
          sortList: params?.filter?.sortList ? {
            columnName: params.filter.sortList.columnName,
            sortType: (params.filter.sortList.sortType as 'asc' | 'desc') || 'asc',
          } : {
            columnName: 'modifiedDate',
            sortType: 'desc',
          },
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group-sub-items', params.bucketProcessId, params.page, params.pageSize, params.filter],
  });

  return query;
};

export default useGetParameterGroupSubItems;
