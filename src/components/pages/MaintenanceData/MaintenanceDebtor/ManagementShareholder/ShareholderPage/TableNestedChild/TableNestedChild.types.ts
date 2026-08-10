import type { TableCellProps, TableRowProps } from '@mui/material';


export type TableNestedChildProps = {
  currentPage?: number | null;
  footer?: React.ReactNode;
  handlePageChange?: (page: number) => void;
  isLoading?: boolean;
  isPaper?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  minHeight?: string;
  minWidth?: string;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize?: number;
  tableData: Array<any>;
  tableHeader: Array<TableHeader>;
  totalPage?: number | null;
  anomalyRow?: (val: any) => TableRowProps['sx'];
  parentLevel?: Array<any>;
  lastLevel?: number;
  canEditShareholder?: boolean;
}

export type options = Array<{
  iconName: string;
  onClick: (data: any, index: number) => void;
  isDisabled?: boolean | ((data: any) => boolean);
  isLoading?: boolean | ((data: any) => boolean);
}>;

export type TableHeader = {
  label?: string;
  key: string;
  type?: 'index' | 'action' | 'checkbox' | 'status' | 'date' | 'textHtml' | 'multiple-autocomplete';
  isDisabled?: (row: any) => boolean;
  isSelected?: (row: any) => boolean;
  onSelectChange?: (row: any) => void;
  options?: options | ((row?: any) => options);
  render?: (row: any, index: number) => React.ReactNode;
  sx?: ((row?: any) => TableCellProps['sx']) | TableCellProps['sx'];
}

export type onDndProps = {
  newTableData: Array<any>;
  previousItem: any;
  nextItem: any;
  currentItem: any;
  currentIndex: number;
}
