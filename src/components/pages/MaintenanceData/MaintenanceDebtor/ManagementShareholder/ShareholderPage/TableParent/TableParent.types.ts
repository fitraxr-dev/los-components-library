import type { TableHeader } from '@/components/shared/Table/Table.types';


type Shareholder = {
  childList: Shareholder[] | null;
  id: number;
  level: number;
  name: string;
  parentId: number | null;
  percentage: number;
  shares: number;
  type: string;
  typeLabel: string;
};

type ParentShareholder = {
  childList: Shareholder[];
  parentId: number | null;
  totalPercentage: number;
  totalShares: number;
};

type ShareholderData = {
  level: number;
  shareholders: ParentShareholder[];
};


export type TableParentProps = {
  tableData?: ShareholderData[];
  isLoading?: boolean;
  tableHeader: Array<TableHeader>;
  parentLevel: Array<any>;
  canEditShareholder?: boolean;
}
