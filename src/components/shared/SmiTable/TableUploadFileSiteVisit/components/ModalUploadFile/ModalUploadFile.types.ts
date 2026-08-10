import type {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
} from '@/services/openapi/bucket-document-service';


export type ModalUploadFileProps = {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  ownership: DocumentCreationRequestDtoOwnershipEnum;
  module: string;
  process: string;
  id?: number;
  title?: string;
  ownerId?: string;
  documentCategory?: DocumentTypeRequestDtoDocumentCategoryEnum;
}
