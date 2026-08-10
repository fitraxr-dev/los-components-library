import type {
  BaseResponseGenericSingleDtoBucketCreateResponseDto,
  PipelineCreationDto,
} from '@/services/openapi/bucket-service';
import type { DebtorListResponseDto } from '@/services/openapi/master-service';
import type { UseMutateFunction } from '@tanstack/react-query';


export type ModalExistingUserProps = {
  hasDuplicate: boolean;
  similarDebtorList: Array<DebtorListResponseDto>;
  payload: PipelineCreationDto;
  checkedName: string;
  callback: () => {};
}
