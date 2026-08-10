import type {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';


export type ModalUploadDocumentProps = {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  ownership: DocumentCreationRequestDtoOwnershipEnum;
  module: string;
  process: string;
  id?: number;
  title?: string;
  ownerId?: string;
}
