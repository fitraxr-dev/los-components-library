import { useQuery } from '@tanstack/react-query';


import { OtpControllerApi } from '@/services/openapi/auth-service';


const api = new OtpControllerApi();

const useGetOtpStatus = ({ token }: {token: string}) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.statusOtpUser({ headers: { Authorization: token } });

      return res.data.data?.content;
    },
    queryKey: ['otp-status'],
  });
  return query;
};

export default useGetOtpStatus;
