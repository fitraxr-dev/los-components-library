import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type ModalAddProps = {
  documentParent?: DocumentCreationRequestDtoDocumentParentEnum;
  module: string;
  process: string;
  bucketProcessId?: string;
  title?: string;
}
