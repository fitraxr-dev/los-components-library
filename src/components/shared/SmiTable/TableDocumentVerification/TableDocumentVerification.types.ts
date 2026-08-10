import type { TableCellProps, TableRowProps } from '@mui/material';


export type TableDocumentVerificationProps = {
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
  renderInBetweenRow?: (data: any) => React.ReactNode;
  renderAdditonalRow?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  tableData: Array<any>;
  tableHeader: Array<TableHeaderVerification>;
  tableHeaderChild?: Array<TableHeaderVerification>;
  tableHeaderGrandChild?: Array<TableHeaderVerification>;
  totalPage?: number | null;
  anomalyRow?: (val: any) => TableRowProps['sx'];
  setTableData?: (data: Array<any>) => void;
  onDragAndDrop?: (onDndProps) => void;
  listDiff?: string[];
}

export type options = Array<{
  iconName: string;
  onClick: (data: any, index: number) => void;
  isDisabled?: boolean | ((data: any) => boolean);
  isLoading?: boolean | ((data: any) => boolean);
}>;

export type TableHeaderVerification = {
  label?: string;
  key: string;
  type?: 'index' | 'action' | 'checkbox' | 'status' | 'date' | 'textHtml' | 'multiple-autocomplete' | 'isChild' | 'isGrandChild';
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


export type BgColumnProps = {
  index?: number;
  docId?: string;
  data?: Array<any>;
}
