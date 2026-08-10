import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getCookie } from '@/helpers/cookie';
import { BASE_PATH } from '@/services/openapi/auth-service/base';

import type { UserDetailv2Response } from '@/services/openapi/auth-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const getReassignmentData = () => {
  try {
    const reassignmentCookie = getCookie('reassignment');
    if (reassignmentCookie) {
      return JSON.parse(reassignmentCookie);
    }
    return {};
  } catch (error) {
    console.error('Error parsing reassignment cookie:', error);
    return {};
  }
};

const useGetProfile = (
  config?: Partial<UseQueryOptions<UserDetailv2Response>>,
) => {
  const token = getCookie('token');
  const query = useQuery<UserDetailv2Response>({
    enabled: !!token,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      console.log('Fetching user profile...');

      const reassignmentPayload = getReassignmentData();

      const requestBody = Object.keys(reassignmentPayload).length > 0
        ? reassignmentPayload
        : {};

      const res = await axios.post(
        `${BASE_PATH}/v2/auth/profile`,
        requestBody,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data.data;
    },
    queryKey: ['user-profile'],
    // refetchInterval: 3000,
    // staleTime: Infinity,
    ...config,
  });

  return query;
};

export default useGetProfile;
