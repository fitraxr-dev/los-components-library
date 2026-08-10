import type { TypeModule, TypeProcess } from '@/enums/Module';


export interface AlertDocumentUpdatesProps {
  document: 'BENEFICIAL_OWNER' | 'CUSTOMER_DUE_DILIGENCE' | (string & {});
  applicationCategory: 'APU_PPT' | 'DATA_UPDATES' | (string & {});
  process: TypeProcess;
  module: TypeModule;
  message: string;
  refetchInterval?: number | false;
}
