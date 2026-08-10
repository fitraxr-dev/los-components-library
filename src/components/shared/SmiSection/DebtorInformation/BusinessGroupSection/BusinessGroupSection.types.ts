import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { Dispatch, SetStateAction } from 'react';


export type BusinessGroupSectionProps = {
  businessGroupDropdownData: Array<{
    label: string;
    value: string;
  }>;
  tableData: Array<{}>;
  tablePage: {
    totalPage?: number;
  };
  itemPerPage: number;
  noPage: number;
  setItemPerPage: Dispatch<SetStateAction<number>>;
  setNoPage: Dispatch<SetStateAction<number>>;
  tableHeader: TableHeader[];
  handleDeleteGroupBusiness: (id) => void;
  handleOpenAddModal: () => void;
  tableLoading: boolean;
  hasTableFooter?: boolean;
}
