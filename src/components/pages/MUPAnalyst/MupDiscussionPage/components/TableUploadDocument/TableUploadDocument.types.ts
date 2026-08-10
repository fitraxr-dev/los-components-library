import type { options, TableHeader } from '@/components/shared/Table/Table.types';
import type { Dispatch, SetStateAction } from 'react';


export type TableUploadDocumentProps = {
  process: string;
  module: string;
  title?: string;
  bcmId?: string | number;
  tableHeader: TableHeader[];
  tableData: Array<Record<PropertyKey, any>>;
  documentParent?: string;
  isLoading: boolean;
  tablePage: TablePage;
  noPage: number;
  setNoPage: Dispatch<SetStateAction<number>>;
  setItemPerPage: Dispatch<SetStateAction<number>>;
  handleOpenAddModal: () => void;
  tableActionOptions?: options | ((row?: any) => options);
  hasAddButton?: boolean;
}

type TablePage = {
  totalPage?: number;
  noPage?: number;
}

export type EditDocumentProps = {
  id: number | string;
  module: string;
  process: string;
  ownership?: string;
  childId?: string | number;
}
