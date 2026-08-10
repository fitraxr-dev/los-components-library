import fetch from '@/helpers/fetch';

import type { BaseResponseGenericSingleDtoOtpResponseDto, OtpRequestDto } from '@/services/openapi/auth-service';


const getUrl = () => '/api/auth/login/validate/otp';

type OtpValidateDto = OtpRequestDto & {
  token: string;
}

const validateOtp = async (body: OtpValidateDto) => {
  const url = getUrl();
  try {
    const response = await fetch.post(url, body);
    return response;
  } catch (error) {
    // Log error to logger, then rethrow error
    throw error.response.data;
  }
};

export default validateOtp;
