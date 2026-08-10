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
  krediturList?: KrediturValues[];
  agentList?: SyndicationAgentValues[];
  feeList?: FeeValues[];
}

interface KrediturValues {
  jenisKreditur?: string;
  namaKreditur?: string;
  amount?: number;
}

interface SyndicationAgentValues {
  agentType?: string;
  bankType?: string;
  bankName?: string;
}

interface FeeValues {
  feeType?: string;
  nominal?: number;
  remarks?: string;
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
