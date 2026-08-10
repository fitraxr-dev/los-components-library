import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type MemoSupplementProps = {
  documentParent?: DocumentCreationRequestDtoDocumentParentEnum;
  module?: TypeModule;
  process?: TypeProcess;
  title?: string;
}
