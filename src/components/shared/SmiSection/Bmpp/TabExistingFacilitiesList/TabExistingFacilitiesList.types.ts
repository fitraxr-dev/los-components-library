import type { TypeModule, TypeProcess } from '@/enums/Module';
import type {
  BmppDetailRequestDtoBmppTypeEnum,
  BmppGroupsRequestDtoBmppTypeEnum,
} from '@/services/openapi/mip-service';


export type TabExistingFacilitiesProps = {
  module: TypeModule;
  process: TypeProcess;
  handleNext: () => void;
  debtorName: string;
  viewOnly?: boolean;
  processId: string;
  debtorId?: string;
  withTableDebtorInformation?: boolean;
  isPemda?: boolean;
  tableDataDebtor: Array<{[key: PropertyKey]: any}>;
  isTableDataDebtorLoading?: boolean;
  isTableDataDebtorSuccess?: boolean;
  bmppType?: BmppDetailRequestDtoBmppTypeEnum | BmppGroupsRequestDtoBmppTypeEnum;
  isMipBmpp?: boolean;
  groupOptionsList?: Array<{[id: PropertyKey]: any}>;
  disableExchangeRate?: boolean;
  hideActionButton?: boolean;
  isUseGetMasterDetail?: boolean;
}
