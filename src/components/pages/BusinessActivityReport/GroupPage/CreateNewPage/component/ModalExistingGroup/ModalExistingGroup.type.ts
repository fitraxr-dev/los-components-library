import type { DebtorRequestDto, GroupRequestDto } from '@/services/openapi/bucket-service';


export interface GroupListResponseDTO {
  id: string;
  name: string;
  sector: string;
  sectorLabel: string;
  groupType: string;
  groupTypeLabel: string;
  isDebtorJoined: boolean;
  createdBy: string;
  createdDate: string | Date;
  modifiedDate: string | Date;
  modifiedBy: string;
  isRelatedSmi: boolean;
  yearFounded: string;
}

export type ModalExistingGroupProps = {
  hasDuplicate: boolean;
  similarGroupList: Array<GroupListResponseDTO>;
  payload: GroupRequestDto;
}
