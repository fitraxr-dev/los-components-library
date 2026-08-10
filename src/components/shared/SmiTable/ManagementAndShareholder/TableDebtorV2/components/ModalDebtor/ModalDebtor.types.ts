type PopupDebtorForm = {
  name: string;
  npwp: string;
  npwpFile: FileOutput;
  collectibility: string;
  google_search: string;
  report_result: string;
  notes: string;
}

type PopupDebtorProps = {
  id?: number;
  module?: string;
  isRequestMode?: boolean;
  tableType?: string;
};
