export interface RefinaProps {
  bucketProcessId: string;
  module: string;
  process: string;
}


export interface RefinaHookProps extends RefinaProps {
  modalId: string;
}
