import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentProps = SmiComponentProps & {
  // documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  title?: string;
  isReadOnly?: boolean;
  actions?: Object;
  showModalSelector?: boolean;
  ownerId?: string;
  approvedMandatory?: string[];
}

export type EditDocumentProps = {
  id: number | string;
  module: string;
  process: string;
  ownership?: string;
  childId?: string | number;
}
