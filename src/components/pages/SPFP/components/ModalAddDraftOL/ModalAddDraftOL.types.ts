import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type ModalAddDraftProps = {
  documentParent?: DocumentCreationRequestDtoDocumentParentEnum;
  module: TypeModule;
  process: TypeProcess;
  id?: number;
  title?: string;
  nomorDraft?: string;
  draftParent?: string; // Parent's noDraft for child records
  editData?: any; // Data untuk mode edit
  bucketProcessId?: string;
}
