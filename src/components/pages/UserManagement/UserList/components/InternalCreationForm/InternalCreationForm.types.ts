import type { UserDetailDraftV2Response, UserDetailV2Response } from '@/services/openapi/user-management-service';


export type InternalCreationFormProps = {
  detailUser?: {
    data: UserDetailDraftV2Response | UserDetailV2Response;
    isLoading: boolean;
    isSuccess: boolean;
  };
  countResetData: number;
}
