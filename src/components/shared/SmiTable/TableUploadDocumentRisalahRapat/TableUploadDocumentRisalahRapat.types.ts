import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentProps = {
  // documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  process: string;
  module: string;
  title?: string;
  isReadOnly?: boolean;
}

export type EditDocumentProps = {
  id: number | string;
  module: string;
  process: string;
  ownership?: string;
  childId?: string | number;
}
