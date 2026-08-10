export interface ModalBankInformationProps {
  initialBankName?: string;
  initialBankType?: string;
  initialAmount?: number;
  fieldData?: FieldData[];
  addData?: (bankName?: string, bankType?: string, amount?: number, index?: number) => void;
  title?: string;
}

export interface FieldData {
  bankInformationId?: number;
  bankName?: string;
  bankType?: string;
  amount?: number;
  isEditable?: boolean;
}
