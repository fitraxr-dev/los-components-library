import type {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
} from '@/services/openapi/lpa-service';


export interface DocumentCreationRequestDto {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  module: string;
  ownerId: number;
  ownership: DocumentCreationRequestDtoOwnershipEnum;
  process: string;
}
