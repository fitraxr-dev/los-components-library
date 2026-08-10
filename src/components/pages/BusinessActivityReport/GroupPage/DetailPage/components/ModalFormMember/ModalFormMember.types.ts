import type { DocumentDto } from '@/services/openapi/bucket-service';
import type { DebtorDetailResponseDto } from '@/services/openapi/loan-service';


export type DebtorDetailDto = {
  id?: string;
  name?: string;
  sector?: string;
  sectorLabel?: string;
  infrastructureSector?: string;
  infrastructureSectorOther?: string;
  cif?: string;
  yearFounded?: string | number;
  isAffiliated?: boolean;
  relation?: string;
  npwp?: string;
  npwpFile?: string;
  nik?: string;
  remark?: string;
  debtorRemark?: string;
  shareholderRemark?: string;
  managementRemark?: string;
  type?: string;
  typeLabel?: string;
  groupId?: string;
  groupName?: string;
  rmId?: string;
  rmName?: string;
  divisionId?: string;
  divisionName?: string;
  gamId?: string;
  gamName?: string;
  poc?: string;
  userId?: string;
  listDocument?: Array<DocumentDto>;
  debtorCode?: string;
  hasSharedDirectors?: boolean;
  isGuarantorForOther?: boolean;
  hasFinancialDependency?: boolean;
  isControlledBySameParty?: boolean;
  isControllingOther?: boolean;
};

export type ModalFormMemberProps = {
  handleChange?: (values: any) => void;
  initialValues?: {};
  debtorId: string;
  groupId: string;
  title?: string;
  data: DebtorDetailResponseDto;
  type: 'edit' | 'new';
  isBarCreation?: boolean;
};

export type OnSubmitProps = {
  generalAccountManager: string;
  debitorName: string;
  information: string;
  sector: string;
  cif: string;
  hasFinancialDependency: boolean;
  hasSharedDirectors: boolean;
  isControlledBySameParty: boolean;
  isControllingOther: boolean;
  isGuarantorForOther: boolean;
}
