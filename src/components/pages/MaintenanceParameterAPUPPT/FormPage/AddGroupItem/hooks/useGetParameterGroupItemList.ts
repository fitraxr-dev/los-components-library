import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterGroupItemList = (bucketProcessId, effectiveGroupId, page = 1, pageSize = 10, applicationType = '', filter = null) => {
  const query = useQuery({
    enabled: true, // Enable automatic fetching for item list
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.itemList', {
        data: {
          filter: {
            ...filter?.filter,
            bucketProcessId: bucketProcessId === 'null' ? null : bucketProcessId,
            id: effectiveGroupId || null,
          },
          page: {
            itemPerPage: pageSize,
            noPage: page,
          },
          searchDetail: {
            key: filter?.searchDetail?.key || '',
            value: filter?.searchDetail?.value || '',
          },
          sortList: filter?.sortList ? {
            columnName: filter.sortList.columnName,
            sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
          } : {
            columnName: 'modifiedDate',
            sortType: 'desc',
          },
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'item-list', bucketProcessId, effectiveGroupId, page, pageSize, filter], // Include filter in queryKey
  });

  return query;
};

export default useGetParameterGroupItemList;
