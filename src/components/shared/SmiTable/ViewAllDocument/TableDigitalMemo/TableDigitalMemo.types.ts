import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TypeModule, TypeProcess } from '@/enums/Module';


export type TableDigitalMemoProps = {
  module: TypeModule;
  process: TypeProcess;
  id?: string | number;
  useSelected?: boolean;
  selectedItems?: any[];
  onItemSelection?: (item: any, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean, allItems: any[]) => void;
  searchFilter?: SearchValue;
  onSearchChange?: (value: SearchValue) => void;
  existingDocuments?: any[];
}
