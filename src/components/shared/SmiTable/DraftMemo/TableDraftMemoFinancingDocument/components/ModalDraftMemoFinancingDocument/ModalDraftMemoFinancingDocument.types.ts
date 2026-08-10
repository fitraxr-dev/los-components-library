export type ModalDraftMemoFinancingDocumentProps = {
  process: string;
  module: string;
  id?: string;
  blacklist: {
    documentId: number;
    label: string;
    value: string;
  }[];
}
