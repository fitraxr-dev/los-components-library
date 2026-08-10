import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableEloDocumentProps = {
  documentParent: DocumentCreationRequestDtoDocumentParentEnum;
  module: TypeModule;
  process: TypeProcess;
  title: string;
}
