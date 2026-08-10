import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { UserDetailResponse } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useGetDetailUser = (
  userId: string,
  config?: Partial<UseQueryOptions>
) => {
  const isApplicationDetail = (userId: string) => {
    return userId.startsWith('UM-');
  };

  const query = useQuery<UserDetailResponse>({
    enabled: userId !== undefined,

    queryFn: async () => {
      if (isApplicationDetail(userId)) {
        const payload = {
          bucketProcessId: userId,
          module: TypeModule.USER_MANAGEMENT,
          process: TypeProcess.USER_MANAGEMENT,
        };

        const res = await api.detailUserApplication(payload);
        return res.data.data;

      } else {
        const payload = {
          userId,
        };

        const res = await api.detailUser(payload);
        return res.data.data;
      }
    },
    queryKey: ['detail-user'],
    ...config,
  });

  return query;
};

export default useGetDetailUser;
