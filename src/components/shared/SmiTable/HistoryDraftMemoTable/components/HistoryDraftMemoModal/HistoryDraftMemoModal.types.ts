export type SaveDataProps = {
  uploadBy: string;
  uploadDate: string;
  documentName: string;
  documentDate: string;
  document: {
    extension: string;
    file: string;
    name: string;
    url: string;
  };
}
