export type ModalUploadDocumentProps = SmiComponentProps & {
  ownerId?: string;
  withDocElo?: boolean;
  isExistingMode?: boolean;
  existingDocuments?: any[];
  disableGroupOnKtpNpwp?: boolean;
  isDepi?: boolean;
}
