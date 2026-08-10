export interface LpaDiff {
  id: string;
  bucketProcessId: string;
  changes: boolean;
  updated: boolean;
}

export interface TableLPAInformationProps {
  processId: string;
  module?: string;
  process?: string;
  lpaDiffs?: LpaDiff[];
}
