import type { SxProps, TableCellProps, TableRowProps, Theme } from '@mui/material';


export type TableProps = {
  currentPage?: number | null;
  footer?: React.ReactNode;
  handlePageChange?: (page: number) => void;
  isLoading?: boolean;
  isPaper?: boolean;
  isMaintenanceParameterBar?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  minHeight?: string;
  minWidth?: string;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize?: number;
  renderInBetweenRow?: (data: any) => React.ReactNode;
  renderAdditonalRow?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  tableData: Array<any>;
  tableHeader: Array<TableHeader>;
  totalPage?: number | null;
  anomalyRow?: (val: any) => TableRowProps['sx'];
  setTableData?: (data: Array<any>) => void;
  onDragAndDrop?: (onDndProps) => void;
  withConditional?: boolean;
  emptyMessage?: string;

}

export type options = Array<{
  iconName: string;
  onClick?: (data: any, index: number) => void;
  isUseOnclick?: boolean;
  isMultiDocument?: boolean;
  isDisabled?: boolean | ((data: any) => boolean);
  isLoading?: boolean | ((data: any) => boolean);
  isHidden?: boolean | ((data: any) => boolean);
  isPreview?: boolean | ((data: any) => boolean);
  apiDownload?: string;
}>;

export type TableHeader = {
  label?: string | React.ReactNode;
  key: string;
  type?: 'index' | 'action' | 'checkbox' | 'status' | 'date' | 'textHtml' | 'multiple-autocomplete' | 'date-only' | 'time-only' | 'boolean' | 'radio';
  isDisabled?: (row: any) => boolean | boolean;
  isSelected?: (row: any) => boolean;
  isHidden?: (row: any) => boolean;
  onSelectChange?: (row: any) => void;
  options?: options | ((row?: any) => options);
  render?: (row: any, index: number) => React.ReactNode;
  sx?: ((row?: any) => TableCellProps['sx']) | TableCellProps['sx'];
  colSpan?: number | ((row: any) => number);
  skipRender?: (row: any) => boolean;
  preserveZero?: boolean;
}

export type onDndProps = {
  newTableData: Array<any>;
  previousItem: any;
  nextItem: any;
  currentItem: any;
  currentIndex: number;
}
