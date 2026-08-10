export interface InquiryAccountResponse {
  cif: string;
  customerName: string;
  customerNumber: string | number;
  accountNumber: string;
  currency: string;
  no: string;
  saldo: string | number;
  responseFlag: string;
  deskripsiT24: string;
}
