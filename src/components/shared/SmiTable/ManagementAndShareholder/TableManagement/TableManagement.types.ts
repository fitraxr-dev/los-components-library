export type TableManagementProps = {
  module: string;
  onSelectedChange: (val) => void;
  selected: Array<any>;
  viewOnly: boolean;
  status: string;
  tableType: string;
}
