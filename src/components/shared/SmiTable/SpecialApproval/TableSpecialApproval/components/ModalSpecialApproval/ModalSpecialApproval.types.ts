export type ModalSpecialApprovalProps = {
  initialValues: FormData;
  module: string;
  process: string;
}

export type FormData = {
  id: number;
  typeSpecialApproval: string;
  specialNote: string;
  description: string;
}
