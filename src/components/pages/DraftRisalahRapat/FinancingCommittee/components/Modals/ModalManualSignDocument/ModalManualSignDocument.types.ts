export type SaveDataProps = {
  uploadBy: string;
  uploadDate: string;
  documentName: string;
  documentDate: string;
  documentNumber: string;
  documentId: number;
  document: {
    extension: string;
    file: string;
    name: string;
    url: string;
  };
}
