export interface ErrorUploadData {
  rowNumber: string | number;
  errorMessage: string;
}

export interface ModalErrorUploadTemplateProps {
  modalId?: string;
  title?: string;
  data?: ErrorUploadData[];
}
