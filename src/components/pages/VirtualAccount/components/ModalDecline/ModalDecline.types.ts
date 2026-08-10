export type ModalCommentProps = {
  initialComment?: string;
  viewOnly?: boolean;
  onCancel: (value: ModalCommentOnSaveProp) => void;
  onReject: (value: ModalCommentOnSaveProp) => void;
  radioLabel?: string;
  radioOptions?: Array<{
    label: string;
    value: string;
  }>;
  submitText?: string;
  isLoading?: boolean;
  isRadioMandatory?: boolean;
  title?: string;
}

type ModalCommentOnSaveProp = {
  comment: string;
}
