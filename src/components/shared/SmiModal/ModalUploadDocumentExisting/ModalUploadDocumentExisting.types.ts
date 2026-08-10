export type ModalUploadDocumentExistingProps = SmiComponentProps & {
  blacklist: number[] | any[];
  documentCategory?: string[];
  documentCategoryDisabled?: boolean;
  debtorId?: string;
  documentParent?: string;
  module?: string;
  process?: string;
  ownership?: string;
}
