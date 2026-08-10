import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { TypeModule, TypeProcess } from '@/enums/Module';


export type TabProposedFacilitiesListProps = {
  module?: string;
  process?: string;
  handleNext?: () => void;
  withAddButton?: boolean;
  debtorName: string;
  viewOnly?: boolean;
  processId: string;
  id?: string;
  withNextButton?: boolean;
  tableHeaderDebtor: TableHeader[];
  tableHeaderGroup: TableHeader[];
  isPemda?: boolean;
  isIndividual?: boolean;
  groupOptionsList?: Array<{[id: PropertyKey]: any}>;
  detailGroup?: any;
  calculationId?: string;
}
