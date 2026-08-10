import type { TypeModule } from '@/enums/Module';


export interface EditListReportRoutineProps {
  id: number;
  module: TypeModule;
  isBusinessResponse?: boolean;
  title?: string;
}
