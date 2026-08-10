import type { TableHeader } from '@/components/shared/Table/Table.types';
import type {
  FinancingFacilityGroupDebtorResponseDto,
  FinancingFacilityResponseDto,
} from '@/services/openapi/bucket-service';
import type { BmppDetailResponseDto } from '@/services/openapi/master-service';


export type GroupDataFallback = {
  id?: string;
  name?: string;
  [key: string]: any;
};

export type TableGroupProps = {
  tableHeader: TableHeader[];
  idx?: number;
  isLoading?: boolean;
  withAddButton: boolean;
  data?: Object[];
  tableDataGroup?: Array<FinancingFacilityResponseDto>;
  handleOpenAddModal: (groupId?: string) => void;
  viewOnly?: boolean;
  disabledAddNewGroup?: boolean;
  isAllProduct?: Array<{[key: PropertyKey]: any}>;
  isIndividual?: boolean;
  debtorId?: string;
  bmppDetailData?: BmppDetailResponseDto;
  calculationId?: string;
  groupDataFallback?: GroupDataFallback[];
}
