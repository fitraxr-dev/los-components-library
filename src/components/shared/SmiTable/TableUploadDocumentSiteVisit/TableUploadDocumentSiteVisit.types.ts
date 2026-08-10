import type {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentSiteVisitProps = {
  process: string;
  module: string;
  title?: string;
  uuid?: string;
  ownership: DocumentTypeRequestDtoOwnershipEnum;
  documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum;
  disabled?: boolean;
  isValid?: boolean;
  bucketProcessId?: string;
}
