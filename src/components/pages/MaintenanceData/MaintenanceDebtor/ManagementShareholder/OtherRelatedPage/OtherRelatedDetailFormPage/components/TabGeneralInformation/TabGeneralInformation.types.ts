export type TabGeneralInformationProps = {
  isDetailPage?: boolean;
}

export type FormValues = {
  idDocFile?: FileOutput;
  idNumber: number;
  idType: string;
  identityExpiry: string;
  institutionType: string;
  jobPosition: string;
  lastModified: string;
  modifiedBy: string;
  name: {
    fullName: string;
    prefix: string;
    suffix: string;
  };
  npwp: string;
  npwpDocFile: FileOutput;
  refId: string;
}
