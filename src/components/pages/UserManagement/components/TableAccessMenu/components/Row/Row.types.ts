export type RowProps = {
  tableHeader: any[];
  compute: (checkboxId: string, status: number) => void;
  items: any[];
  viewOnly?: boolean;
}
