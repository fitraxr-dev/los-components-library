import type { UseFormReturn } from 'react-hook-form';


export interface BankInformationTableProps {
  methods?: UseFormReturn<SindikasiData>;
  isReadOnly?: boolean;
};

interface SindikasiData {
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
    agentLabel?: string;
    agentType?: string;
    isEditable?: boolean;
  }[];
  bankInformationList?: {
    isEditable?: boolean;
    amount?: number;
    bankInformationId?: number;
    bankName?: string;
    bankType?: string;
  }[];
  facilityAgentList?: {
    agentId?: number;
    agentLabel?: string;
    agentType?: string;
    isEditable?: boolean;
  }[];
  securityAgentList?: {
    agentId?: number;
    agentLabel?: string;
    agentType?: string;
    isEditable?: boolean;
  }[];
}
