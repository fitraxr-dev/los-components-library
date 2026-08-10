export type ModalUploadDocumentRisalahProps = {
  bucketProcessId?: string;
  module?: string;
  process?: string;
  documentParent?: string;
  documentId?: number;
  isEdit?: boolean;
  initialData?: {
    documentName?: string;
    documentNumber?: string;
  };
};
