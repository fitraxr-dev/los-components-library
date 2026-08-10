import { API } from '@/helpers/api';
import bucket from '@/services/endpoint/bucket';


export interface RegisterBucketRequest {
  module: string;
  process: string;
  debtorId: string;
  additionalData: string;
}

export interface RegisterBucketResponse {
  bucketProcessId: string;
  message?: string;
  success: boolean;
}

/**
 * Register bucket for parameter business call
 */
export const registerBucket = async (
  payload: RegisterBucketRequest
): Promise<any> => {
  try {
    const response = await API('bucket.register.debtor', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};
