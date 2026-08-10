import type { TypeModule, TypeProcess } from '@/enums/Module';
import type {
  BmppDetailRequestDtoBmppTypeEnum,
  BmppGroupsRequestDtoBmppTypeEnum,
} from '@/services/openapi/mip-service';


export type TabExistingFacilitiesProps = {
  module?: TypeModule;
  process?: TypeProcess;
  handleNext?: () => void;
  debtorName: string;
  viewOnly?: boolean;
  processId: string;
  id?: string;
  isPemda?: boolean;
  isIndividual?: boolean;
  bmppType?: BmppDetailRequestDtoBmppTypeEnum | BmppGroupsRequestDtoBmppTypeEnum;
  groupOptionsList?: Array<{[id: PropertyKey]: any}>;
  detailGroup?: any;
  calculationId?: string;
}
