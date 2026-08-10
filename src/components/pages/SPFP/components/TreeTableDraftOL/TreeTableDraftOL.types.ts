import type { TableCellProps, TableRowProps } from '@mui/material';


export type TableProps = {
  currentPage?: number | null;
  footer?: React.ReactNode;
  handlePageChange?: (page: number) => void;
  isLoading?: boolean;
  isPaper?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize?: number;
  renderInBetweenRow?: (data: any) => React.ReactNode;
  renderAdditonalRow?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  tableData: Array<any>;
  tableHeader: Array<any>;
  totalPage?: number | null;
  hidden?: boolean;
  anomalyRow?: (val: any) => TableRowProps['sx'];
  isDti?: boolean;
}

type options = Array<{
  iconName: string;
  onClick: (data: any, index: number) => void;
  isDisabled?: boolean | ((data: any) => boolean);
}>;

export type TableHeader = {
  label?: string;
  key: string;
  type?: 'index' | 'action' | 'checkbox';
  isDisabled?: (row: any) => boolean;
  isSelected?: (row: any) => boolean;
  onSelectChange?: (row: any) => void;
  options?: options | ((row?: any) => options);
  render?: (row: any, index: number) => React.ReactNode;
  sx?: TableCellProps['sx'];
  headerSx?: TableCellProps['sx'];
}
