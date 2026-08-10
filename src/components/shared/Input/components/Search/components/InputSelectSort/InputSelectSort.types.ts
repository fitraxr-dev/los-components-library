export type InputSelectSortProps = {
  label?: string;
  data?: Array<{
    value: string;
    label: string;
  }>;
  onChange?: (val: SortValue) => void;
  value?: SortValue;
  disabled?: boolean;
}

type SortValue = {
  columnName: string;
  sortType: 'ASC' | 'DESC' | null;
}
