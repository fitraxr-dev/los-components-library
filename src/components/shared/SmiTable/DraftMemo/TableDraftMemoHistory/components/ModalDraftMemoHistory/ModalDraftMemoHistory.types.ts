import type { TypeModule, TypeProcess } from '@/enums/Module';


export type SaveDataProps = {
  uploadBy: string;
  uploadDate: string;
  documentName: string;
  documentDate: string;
  module: TypeModule;
  process: TypeProcess;
  document: {
    extension: string;
    file: string;
    name: string;
    url: string;
  };
}
