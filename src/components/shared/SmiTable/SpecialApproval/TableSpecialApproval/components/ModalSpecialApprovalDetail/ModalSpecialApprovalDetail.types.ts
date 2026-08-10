export type ModalSpecialApprovalDetailProps = {
  type: 'OTHERS' | 'NON_OTHERS';
  initialValues: FormData;
}

export type FormData = {
  id: number;
  typeSpecialApproval: string;
  typeSpecialApprovalLabel: string;
  specialNote: string;
  description: string;
}
