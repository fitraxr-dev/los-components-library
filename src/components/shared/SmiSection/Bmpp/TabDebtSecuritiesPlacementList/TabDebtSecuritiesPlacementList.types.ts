import type { TypeModule, TypeProcess } from '@/enums/Module';


export type TabDebtSecuritiesPlacementListProps = {
  module: TypeModule;
  process: TypeProcess;
  handleNext: () => void;
  debtorName: string;
  isPemda: boolean;
  viewOnly?: boolean;
  processId: string;
  handleOnClickInquiry: () => void;
  withTableDebtorInformation?: boolean;
  tableDataDebtor: Array<{[key: PropertyKey]: any}>;
  tableDataGroup: Array<{[key: PropertyKey]: any}>;
  isTableDataDebtorLoading?: boolean;
  isTableDataGroupLoading?: boolean;
  isTableDataDebtorSuccess?: boolean;
  isUseGetMasterDetail?: boolean;
}
