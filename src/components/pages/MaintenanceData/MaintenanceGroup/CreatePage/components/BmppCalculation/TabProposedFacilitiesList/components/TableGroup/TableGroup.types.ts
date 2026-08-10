import type { TableHeader } from '@/components/shared/Table/Table.types';
import type {
  FinancingFacilityGroupDebtorResponseDto,
  FinancingFacilityResponseDto,
} from '@/services/openapi/bucket-service';
import type { BmppDetailResponseDto } from '@/services/openapi/master-service';


export type TableGroupProps = {
  tableHeader?: TableHeader[];
  idx?: number;
  isLoading?: boolean;
  data?: Object[];
  tableDataGroup?: Array<FinancingFacilityResponseDto>;
  handleOpenAddModal?: (groupId?: string) => void;
  viewOnly?: boolean;
  isIndividual?: boolean;
  disabledAddNewGroup?: boolean;
  isAllProduct?: Array<{[key: PropertyKey]: any}>;
  debtorId?: string;
  bmppDetailData?: BmppDetailResponseDto;
  calculationId?: string;
}
