import type { TypeModule, TypeProcess } from '@/enums/Module';


export type TabSummaryProps = {
  module: TypeModule;
  process: TypeProcess;
  handleNext: () => void;
  processId: string;
  viewOnly?: boolean;
  withTableDebtorInformation?: boolean;
  standaloneBmppSimulation?: boolean;
  isUseGetMasterDetail?: boolean;
}
