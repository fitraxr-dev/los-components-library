import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentSPFPProps = {
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  module?: TypeModule;
  process?: TypeProcess;
  title?: string;
  showButton?: boolean;
  shouldDisable?: boolean;
  showModalSelector?: boolean;
}
