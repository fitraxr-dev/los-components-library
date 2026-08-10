import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';


export interface FormProps {
  watch: UseFormWatch<{
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    group?: string;
    customer?: string;
    isRelation?: boolean;
  }>;
  setValue: UseFormSetValue<{
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    group?: string;
    isRelation?: boolean;
    customer?: string;
  }>;
  reset: UseFormReset<{
    group?: string;
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    customer?: string;
    isRelation?: boolean;
  }>;
}

export interface TabBmppCalculationProps {
  module: TypeModule;
  process: TypeProcess;
  handleNext?: () => void;
  isPemda?: boolean;
  processId: string;
  calculationId: string;
  bmppType: BmppDetailRequestDtoBmppTypeEnum | BmppGroupsRequestDtoBmppTypeEnum;
  debtorId: string;
  viewOnly?: boolean;
  dataMasterDebtor?: DebtorDetailResponseDto | any;
  onDataChange?: (data) => void;
  isIndividual?: boolean;
}

export type UseTabCalculationProps = TabBmppCalculationProps & FormProps

interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

interface MaintenanceGroupSubmissionFilterRequest {
  bucketProcessId?: string;
  sectors?: Array<object>;
  statuses?: Array<object>;
}

export interface GenericBucketRequestDtoMaintenanceGroupSubmissionFilterRequest {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: MaintenanceGroupSubmissionFilterRequest;
}

export enum BmppDetailRequestDtoBmppTypeEnum {
  PEMDA = 'PEMDA',
  NONPEMDA = 'NON_PEMDA',
  SIMULATIONPEMDA = 'SIMULATION_PEMDA',
  SIMULATIONNONPEMDA = 'SIMULATION_NON_PEMDA'
}

export enum BmppGroupsRequestDtoBmppTypeEnum {
  PEMDA = 'PEMDA',
  NONPEMDA = 'NON_PEMDA',
  SIMULATIONPEMDA = 'SIMULATION_PEMDA',
  SIMULATIONNONPEMDA = 'SIMULATION_NON_PEMDA'
}

export interface BmppGroupsRequestDto {
  bucketProcessId: string;
  module: string;
  process: string;
  bmppType: BmppGroupsRequestDtoBmppTypeEnum;
  groupId?: string;
  debtorId?: string;
}

export interface BmppGroupsComponentResponseDto {
  bucketProcessId?: string;
  process?: string;
  module?: string;
  groupId?: string;
  groupName?: string;
  key?: string;
  detail?: string;
  sequence?: number;
  isParent?: boolean;
  value?: string;
  valueType?: string;
  additionalInformation?: string;
  colorText?: string;
  colorBackground?: string;
}

export interface RequestByIdDtoString {
  id?: string;
}

export interface DebtorDetailResponseDto {
  name?: string;
  isGroup?: boolean;
  isRelatedToSmi?: boolean;
  debtorType?: string;
  debtorTypeLabel?: string;
  refinaId?: string;
  sector?: string;
  sectorLabel?: string;
  cif?: string;
  isAffiliated?: boolean;
  relation?: boolean;
  isNewDebtor?: boolean;
  npwp?: string;
  nik?: string;
  remark?: string;
  debtorRemark?: string;
  shareholderRemark?: string;
  managementRemark?: string;
  type?: string;
  gamName?: string;
  gamId?: number;
  groupName?: string;
  divisionName?: string;
  staffName?: string;
  debtorId?: string;
  npwpUrl?: string;
  npwpFileName?: string;
  npwpFile?: string;
  status?: string;
  isRegionalGovern?: boolean;
  debtorRating?: string;
  institutionType?: string;
  institutionTypeLabel?: string;
  isExisting?: boolean;
  dataSource?: string;
  dataSourceLabel?: string;
  bucketProcessId?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

export interface BmppDetailRequestDto {
  bucketProcessId: string;
  module: string;
  process: string;
  bmppType: BmppDetailRequestDtoBmppTypeEnum;
  debtorId?: string;
  groupId?: string;
  debtorType?: string;
  debtorRating?: string;
  isRelation?: boolean;
  isGroup?: boolean;
  currency?: string;
  exchangeRate?: string;
  remarks?: string;
}
