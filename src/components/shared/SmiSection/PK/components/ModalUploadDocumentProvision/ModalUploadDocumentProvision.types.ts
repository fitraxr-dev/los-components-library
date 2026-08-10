import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type ModalUploadDocumentProps = {
  docParent: DocumentCreationRequestDtoDocumentParentEnum;
  ownerId?: string;
  process: string;
  module: string;
  id?: number;
  title: string;
  isDetailDisabled?: boolean;
}
