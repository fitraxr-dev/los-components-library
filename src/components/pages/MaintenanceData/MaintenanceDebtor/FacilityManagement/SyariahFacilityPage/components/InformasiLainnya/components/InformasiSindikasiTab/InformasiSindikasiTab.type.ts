export interface InformasiSindikasiForm {
  facilityId?: number;
  childFacilityId?: string;
  facilityNo?: string;
  relationshipManager?: string;
  division?: string;
  accountAgentList: AgentValues[];
  bankInformationList: BankInformationValues[];
  facilityAgentList: AgentValues[];
  isSyndicated: boolean;
  remark?: string;
  lastModified?: string;
  modifiedBy?: string;
  securityAgentList: AgentValues[];
}

export interface AgentValues {
  agentId?: string | number;
  agentType?: string;
  agentLabel?: string;
  isEditable?: boolean;
};

interface BankInformationValues {
  bankInformationId?: string | number;
  isEditable?: boolean;
  amount?: number;
  bankName?: string;
  bankType?: string;
}
