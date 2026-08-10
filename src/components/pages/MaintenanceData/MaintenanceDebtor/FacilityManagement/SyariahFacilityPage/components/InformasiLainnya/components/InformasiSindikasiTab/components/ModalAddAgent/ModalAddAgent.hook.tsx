import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';

import useGetParameterListRaw from '@/hooks/services/useGetParameterListRaw';


const useModalAddAgent = ({
  agentName,
  fieldData,
  type,
}: {
  agentName?: string;
  fieldData?: {
    agentId?: number;
    agentType?: string;
    agentLabel?: string;
    isEditable?: boolean;
  }[];
  type?: string;
}) => {
  const [agent, setAgent] = useState<string>(agentName);
  const [agentType, setAgentType] = useState<string>(type);
  const theme = useTheme();

  const { data: bankTypeList } = useGetParameterListRaw('bankType');
  const bankTypeOptions = useMemo(() => bankTypeList.map((item) => ({
    id: item.value2,
    label: item.value1,
  })), [bankTypeList]);

  const { data: agentList } = useGetParameterListRaw(agentType);
  const agentOptions = useMemo(() => agentList.map((item) => ({
    id: item.value1,
    label: item.value1,
  })), [agentList]);

  const excludedLabels = new Set(fieldData?.map((field) => field?.agentLabel));

  const filteredAgents = agentOptions?.filter((agent) => !excludedLabels.has(agent.id));

  type Option = { label: string; id: string };

  const byValue = (v?: string, list?: Option[]) =>
    (v && list?.find((o) => o?.id === v)) ?? null;

  return {
    agent,
    agentOptions,
    agentType,
    bankTypeOptions,
    byValue,
    filteredAgents,
    setAgent,
    setAgentType,
    theme,
  };
};
export default useModalAddAgent;
