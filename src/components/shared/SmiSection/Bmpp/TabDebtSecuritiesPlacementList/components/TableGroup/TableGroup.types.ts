import type { TableHeader } from '@/components/shared/Table/Table.types';
import type {
  DebtSecuritiesGroupDebtorResponseDto,
  DebtSecuritiesResponseDto,
} from '@/services/openapi/master-service';


export type TableGroupProps = {
  tableHeader: TableHeader[];
  idx: number;
  isLoading: boolean;
  data: DebtSecuritiesGroupDebtorResponseDto ;
  tableData: Array<DebtSecuritiesResponseDto>;
}
