import type { TypeModule, TypeProcess } from '@/enums/Module';


export type ModalFinalDraftOLProps = {
  module: TypeModule;
  process: TypeProcess;
  id?: number;
  title?: string;
  nomorDraft?: string;
  draftParent?: string;
  editData?: any;
  isDetail?: boolean;
  bucketProcessId?: string;
}
