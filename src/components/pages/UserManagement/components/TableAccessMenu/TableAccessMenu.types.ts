export type AccessMenu = {
  id: string;
  label: string;
  status: any;
  subMenu?: AccessMenu[];
  permissions?: Array<{
    id: string;
    label: string;
    status: number;
  }>;
}

export type TableAccessMenuProps = {
  tableHeader: any[];
  tableId: string;
  tableData: AccessMenu[];
  tableLabel: string;
  isLoading: boolean;
  tableIndex: number;
  setTableData?: (data) => void;
  tableStatus?: number;
  viewOnly?: boolean;
  onSelectRow?: (data: AccessMenu[], tableStatus: number) => void;
}
