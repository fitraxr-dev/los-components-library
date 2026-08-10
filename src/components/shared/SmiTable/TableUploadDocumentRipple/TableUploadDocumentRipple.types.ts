import type {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentRippleProps = {
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  process: string;
  module: string;
  title?: string;
  ownership?: DocumentTypeRequestDtoOwnershipEnum;
  childId?: string;
  rippleTo: RippleToDocument[];
  isDocumentCategoryDisable?: boolean;
  type?: DocumentTypeRequestDtoDocumentCategoryEnum;
  documentCategory?: DocumentTypeRequestDtoDocumentCategoryEnum;
  showModalSelector?: boolean;
}


export type RippleToDocument = {
  bucketProcessId: string;
  module: string;
  process: string;
}

export type AddEditModalDocumentProps = {
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  process: string;
  module: string;
  rippleTo: RippleToDocument[];
  isDocumentCategoryDisable?: boolean;
  type?: DocumentTypeRequestDtoDocumentCategoryEnum;
  id?: number;
  childId?: string;
  ownership?: DocumentTypeRequestDtoOwnershipEnum;
}
