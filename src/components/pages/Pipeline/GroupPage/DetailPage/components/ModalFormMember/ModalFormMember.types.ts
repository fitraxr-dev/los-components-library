import type { DebtorDetailResponseDto } from '@/services/openapi/loan-service';


export type ModalFormMemberProps = {
  handleChange?: (values: any) => void;
  initialValues?: {};
  debtorId: string;
  groupId: string;
  title?: string;
  data: DebtorDetailResponseDto;
  type: 'edit' | 'new' | 'detail';
};

export type OnSubmitProps = {
  generalAccountManager: string;
  debitorName: string;
  information: string;
  sector: string;
  cif: string;
}
