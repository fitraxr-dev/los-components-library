type ModalAddSpecialApprovalProps = {
  typeSpecialApproval?: string;
  description?: string;
  specialNote?: string;
  id?: string;
  specialApprovalOptions: Array<{label: string; value: string}>;
}
