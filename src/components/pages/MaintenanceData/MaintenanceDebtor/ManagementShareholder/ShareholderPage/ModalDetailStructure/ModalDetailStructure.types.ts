export type ShareHolderData = {
  id?: string;
  beneficialOwner?: string;
  percentage?: string;
  shareholderName?: string;
  shares?: string;
  type?: string;
  tableData?: any;
  setTableData?: (e) => void;
};


export type ModalShareholderProps = {
  level: number;
  beneficialOwner?: string;
  percentage?: number | string;
  name?: string;
  shares?: number | string ;
  type?: string;
  isParentLevel?: boolean;
  prefix?: string;
  shareholder: string;
  suffix?: string;
  informationSource?: string;
  typeLabel: string;
}
