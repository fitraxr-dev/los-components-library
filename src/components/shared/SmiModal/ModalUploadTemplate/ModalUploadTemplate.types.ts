export interface ModalUploadTemplateProps {
  modalId: string;
  title?: string;
  onUpload?: (file: File) => void;
  onDownloadTemplate?: () => void;
  isLoading?: boolean;
  acceptableFormatsText?: string;
  fileConstraint?: string;
  acceptableMimeTypes?: string[];
  processTemplateType?: string;
  queryKeyList?: string[];
  checkboxList?: { label: string; value: string }[];
  titleCheckbox?: string;
}
