export type ModalDraftMemoSupportingDocumentProps = {
  process: string;
  module: string;
  id?: string;
  blacklist: {
    documentId: number;
    label: string;
    value: string;
  }[];
}
