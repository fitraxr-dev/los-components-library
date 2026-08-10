import type { WatchFieldsInterface } from '../AgentTable/AgentTable.type';


export interface ModalAddAgentProps {
  title: string;
  label1?: string;
  label2?: string;
  addData: (agentName: string, agentType: string, index?: number) => void;
  initialData?: {
    agentName?: string;
    agentType?: string;
  };
  id?: number;
  fieldData?: {
    agentId?: number;
    agentType?: string;
    agentLabel?: string;
    isEditable?: boolean;
  }[];
}
