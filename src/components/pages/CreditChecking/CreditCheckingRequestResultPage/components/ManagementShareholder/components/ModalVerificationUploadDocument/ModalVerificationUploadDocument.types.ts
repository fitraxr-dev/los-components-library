import type {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';


export type ModalVerificationUploadDocumentProps = {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  ownership: DocumentCreationRequestDtoOwnershipEnum;
  ownerId: string;
  process: string;
  module: string;
  status?: string;
}
