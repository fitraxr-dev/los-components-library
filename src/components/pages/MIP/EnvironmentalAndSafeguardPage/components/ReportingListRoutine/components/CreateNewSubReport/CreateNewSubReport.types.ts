import type { TypeModule } from '@/enums/Module';


export interface CreateNewSubReportProps {
  id: number;
  parentId: number;
  module: TypeModule;
}
