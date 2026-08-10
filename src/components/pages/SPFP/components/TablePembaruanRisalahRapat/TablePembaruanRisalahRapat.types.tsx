import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TablePembaruanRisalahRapatProps = {
  isExpired?: boolean;
  isTerminated?: boolean;
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  module?: TypeModule;
  process?: TypeProcess;
  showButton?: boolean;
  title?: string;
}
