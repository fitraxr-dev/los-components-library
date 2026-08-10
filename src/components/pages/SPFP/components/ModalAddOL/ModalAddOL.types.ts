import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type ModalAddProps = {
  documentParent?: DocumentCreationRequestDtoDocumentParentEnum;
  module: TypeModule;
  process: TypeProcess;
  bucketProcessId: string;
  noDraft?: string; // No Draft dari list yang dipilih
  editData?: any; // Data untuk mode edit
}
