import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DebtorDetailResponseDto } from '@/services/openapi/master-service';
import type {
  BmppDetailRequestDtoBmppTypeEnum,
  BmppGroupsRequestDtoBmppTypeEnum,
} from '@/services/openapi/mip-service';
import type { UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';


export interface FormProps {
  watch: UseFormWatch<{
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    group?: string;
    isRelation?: boolean;
  }>;
  setValue: UseFormSetValue<{
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    group?: string;
    isRelation?: boolean;
  }>;
  reset: UseFormReset<{
    group?: string;
    debtorRating?: string;
    debtorType?: string;
    remarks?: string;
    isRelation?: boolean;
  }>;
}

export interface TabBmppCalculationProps {
  module: TypeModule;
  process: TypeProcess;
  handleNext: () => void;
  isPemda?: boolean;
  processId: string;
  bmppType: BmppDetailRequestDtoBmppTypeEnum | BmppGroupsRequestDtoBmppTypeEnum;
  debtorId: string;
  viewOnly?: boolean;
  withTableDebtorInformation?: boolean;
  dataMasterDebtor?: DebtorDetailResponseDto | any;
  standaloneBmppSimulation?: boolean;
  isMipBmpp?: boolean;
  isUseGetMasterDetail?: boolean;
  onDataChange?: (data) => void;
}

export type UseTabCalculationProps = TabBmppCalculationProps & FormProps
