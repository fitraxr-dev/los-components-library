import type { AgentValues } from '../../InformasiSindikasiTab.type';
import type { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';


export interface AgentTableProps {
  showModalSelector?: boolean;
  actions?: Object;
  agentType: string;
  isReadOnly: boolean;
  data?: AgentData[];
  fields?: FieldArrayWithId<AgentValues>[];
  handleAddAgent?: (agentName: string, agentType: string) => void;
  handleDeleteAgent?: (index: number) => void;
  handleEditAgent?: (index: number, agentName: string, agentType: string) => void;
  watchFields?: WatchFieldsInterface;
}

export interface AgentDataList {
  contents: AgentData[];
}

export interface AgentData extends AgentValues {
  index: number;
}

export interface WatchFieldsInterface {
  childFacilityId?: string;
  division?: string;
  facilityId?: number;
  facilityNo?: string;
  isSyndicated?: boolean;
  lastModified?: string;
  modifiedBy?: string;
  relationshipManager?: string;
  remark?: string;
  accountAgentList?: {
    agentId?: number;
    agentType?: string;
    agentLabel?: string;
    isEditable?: boolean;
  }[];
  bankInformationList?: {
    isEditable?: boolean;
    amount?: number;
    bankInformationId?: number;
    bankName?: string;
  }[];
  facilityAgentList?: {
    agentId?: number;
    agentType?: string;
    agentLabel?: string;
    isEditable?: boolean;
  }[];
  securityAgentList?: {
    agentId?: number;
    agentType?: string;
    agentLabel?: string;
    isEditable?: boolean;
  }[];
}
