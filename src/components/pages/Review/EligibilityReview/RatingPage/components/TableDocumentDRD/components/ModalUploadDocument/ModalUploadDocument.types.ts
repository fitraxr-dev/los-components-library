import type {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
} from '@/services/openapi/mip-service';


export type ModalUploadDocumentProps = {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  module: string;
  process: string;
  id?: number;
  title?: string;
  type?: string;
  autoSelectGroupId?: string;
  ownership?: DocumentCreationRequestDtoOwnershipEnum;
}
