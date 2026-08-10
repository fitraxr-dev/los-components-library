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
  action: string;
  level: number;
  parentId?: number;
  beneficialOwner?: string;
  id?: number;
  percentage?: number | string;
  name?: string;
  shares?: number | string ;
  type?: string;
  shareHolderLevel: number;
  isParentLevel?: boolean;
  prefix?: string;
  suffix?: string;
  informationSource?: string;
}
