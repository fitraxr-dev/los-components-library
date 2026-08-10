export type ModalCommentProps = {
  initialComment?: string;
  viewOnly?: boolean;
  onSave: (value: ModalCommentOnSaveProp) => void;
  radioLabel?: string;
  radioOptions?: Array<{
    label: string;
    value: string;
  }>;
  submitText?: string;
  isLoading?: boolean;
}

type ModalCommentOnSaveProp = {
  comment: string;
  radioValue?: string;
}
