import type { DebtorRequestDto } from '@/services/openapi/bucket-service';
import type { DebtorListResponseDto } from '@/services/openapi/master-service';


export type ModalExistingUserProps = {
  hasDuplicate: boolean;
  similarDebtorList: Array<DebtorListResponseDto>;
  payload: DebtorRequestDto;
}
