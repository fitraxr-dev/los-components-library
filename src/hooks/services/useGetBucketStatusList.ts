import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface BucketListStatusRequest {
  module: string;
  process: string;
}

interface BucketStatusItem {
  value: string;
  label: string;
}

const useGetBucketStatusList = (payload: BucketListStatusRequest) => {
  const query = useQuery<BucketStatusItem[]>({
    placeholderData: [],
    queryFn: async () => {
      const res = await API('bucket.bucketList.status', {
        data: payload,
      });

      const contents = res.data?.data?.contents ?? [];

      return contents.map((item: { key: string; label: string }) => ({
        label: item.label,
        value: item.key,
      }));
    },
    queryKey: ['bucket-status-list', payload],
  });

  return query;
};

export default useGetBucketStatusList;
