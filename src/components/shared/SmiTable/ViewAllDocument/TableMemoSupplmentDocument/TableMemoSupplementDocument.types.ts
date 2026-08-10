import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableMemoSupplementDocumentProps = {
  documentParent?: DocumentCreationRequestDtoDocumentParentEnum;
  module?: TypeModule;
  process?: TypeProcess;
  showModalSelector?: boolean;
  title?: string;
}
