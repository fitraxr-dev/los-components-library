import type { Dispatch, SetStateAction } from 'react';


export type ManagementShareholderProps = {
  module?: string;
  onSelectedChange?: (data: Array<number>) => void;
  selected?: Array<number>;
  isRequestMode?: boolean;
  viewOnly?: boolean;
  status?: string;
  tableType?: string;
}
