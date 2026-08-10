import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { TypeModule, TypeProcess } from '@/enums/Module';


export type TabProposedFacilitiesListProps = {
  module: TypeModule;
  process: TypeProcess;
  handleNext?: () => void;
  withAddButton?: boolean;
  debtorName: string;
  viewOnly?: boolean;
  processId: string;
  debtorId: string;
  withNextButton?: boolean;
  tableHeaderDebtor: TableHeader[];
  tableHeaderGroup: TableHeader[];
  tableDataDebtor: Array<{[key: PropertyKey]: any}>;
  tableDataGroup: Array<{[key: PropertyKey]: any}>;
  isTableDataDebtorLoading?: boolean;
  isTableDataDebtorSuccess?: boolean;
  isTableDataGroupLoading?: boolean;
  handleOnClickAddNew?: (val?: string) => void;
  withTableDebtorInformation?: boolean;
  disabledAddNewDebtor?: boolean;
  disabledAddNewGroup?: boolean;
  isPemda?: boolean;
  isMipBmpp?: boolean;
  groupOptionsList?: Array<{[id: PropertyKey]: any}>;
  isUseGetMasterDetail?: boolean;
}
