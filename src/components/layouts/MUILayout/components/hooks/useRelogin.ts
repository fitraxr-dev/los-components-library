import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { API } from '@/helpers/api';


interface ReloginPayload {
  userId: string;
  userIdReassignment: string;
}

interface ReloginResponseData {
  token?: string;
  needPassword?: boolean;
  totalAttemptsPasswordFailed?: number;
  otp?: boolean;
  redirectSSO?: string;
  user?: any;
  listRole?: any[];
  listUserGroup?: any[];
  needChangePassword?: boolean;
  additionalData?: any;
  ldap?: boolean;
}

const useRelogin = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReloginPayload) => {
      try {
        const response = await API('auth.relogin.save', { data: payload });
        return {
          payload,
          responseData: response.data?.data ?? null,
        };
      } catch (error) {
        console.error('API error (relogin):', error);
        throw error;
      }
    },
    mutationKey: ['relogin'],
    onError: (error: any) => {
      console.error('Relogin mutation error:', error);
      onError(error);
    },
    onSuccess: async (result: { responseData: ReloginResponseData | null; payload: ReloginPayload }) => {
      try {
        const { responseData: data, payload } = result;

        if (!data?.token) {
          console.warn('Relogin success but no token found in response:', data);
          onError(new Error('No token in response'));
          return;
        }

        // Set cookies
        if (data.token) {
          Cookies.set('token', data.token, {
            expires: 1,
            path: '/',
            sameSite: 'strict',
            secure: true,
          });

          const userId = data.additionalData?.userDetail?.userId;
          if (userId) {
            Cookies.set('userId', String(userId), {
              expires: 1,
              path: '/',
              sameSite: 'strict',
              secure: true,
            });
          }

          Cookies.set('reassignment', JSON.stringify(payload), {
            expires: 1,
            path: '/',
            sameSite: 'strict',
            secure: true,
          });
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['user-profile']}),
          queryClient.invalidateQueries({ queryKey: ['user-permissions']}),
        ]);

        onSuccess(data);
      } catch (err) {
        console.error('Error during relogin onSuccess flow:', err);
        onError(err);
      }
    },
  });

  return mutation;
};

export default useRelogin;
