import type { AccessMenu } from '../../../components/TableAccessMenu/TableAccessMenu.types';
import type { UserDetailDraftV2Response, UserDetailV2Response } from '@/services/openapi/user-management-service';


export type ExternalCreationFormProps = {
  detailUser?: {
    data: UserDetailDraftV2Response | UserDetailV2Response;
    isLoading: boolean;
    isSuccess: boolean;
  };
  countResetData: number;
}

export interface AccessMenuItems extends AccessMenu {
  subMenu: AccessMenuItems[];
}
