import type {
  DocumentCreationRequestDtoOwnershipEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';


export type TableDocumentCreditChekingResultProps = {
  processId: string;
  ownership: DocumentCreationRequestDtoOwnershipEnum;
  ownerId: string;
  status?: string;
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  process?: string;
}
