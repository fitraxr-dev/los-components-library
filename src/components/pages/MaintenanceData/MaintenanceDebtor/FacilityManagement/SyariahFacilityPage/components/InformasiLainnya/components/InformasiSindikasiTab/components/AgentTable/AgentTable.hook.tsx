import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal } from '../ModalAddAgent/ModalAddAgent.constant';

import {
  TABLE_HEADER_ACCOUNT_AGENT_TABLE,
  TABLE_HEADER_FACILITY_AGENT_TABLE,
  TABLE_HEADER_SECURITY_AGENT_TABLE,
} from './AgentTable.constants';

import type { AgentTableProps } from './AgentTable.type';
import type { ModalAddAgentProps } from '../ModalAddAgent/ModalAddAgent.type';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useAgentTable = ({
  agentType = 'facility',
  isReadOnly = false,
  handleAddAgent,
  handleDeleteAgent,
  handleEditAgent,
  watchFields,
}: AgentTableProps) => {
  const theme = useTheme();

  const addData = (agentName: string, agentType: string) => {
    handleAddAgent(agentName, agentType);

    closeNiceModal(modal.MODAL_ADD_AGENT);
  };

  const editData = (index: number, agentName: string, agentType: string) => {
    handleEditAgent(index, agentName, agentType);

    closeNiceModal(modal.MODAL_ADD_AGENT);
  };

  const handleOpenModalUploadDocument = () => {
    // childId optional sesuai kebutuhan (pk, ls)
    let agentTitle = '';
    let agentTypeTitle = '';
    let fieldData = [];

    if (agentType === 'facility') {
      agentTitle = 'Facility Agent';
      agentTypeTitle = 'Jenis Facility Agent';
      fieldData = watchFields?.facilityAgentList;
    } else if (agentType === 'account') {
      agentTitle = 'Account Agent';
      agentTypeTitle = 'Jenis Account Agent';
      fieldData = watchFields?.accountAgentList;
    } else {
      agentTitle = 'Security Agent';
      agentTypeTitle = 'Jenis Security Agent';
      fieldData = watchFields?.securityAgentList;
    }

    const createProps: ModalAddAgentProps = {
      addData,
      fieldData,
      label1: agentTypeTitle,
      label2: agentTitle,
      title: `Add ${agentTitle}`,
    };
    NiceModal.show(modal.MODAL_ADD_AGENT, createProps);
  };

  const handleOpenModalEditAgent = (index: number, agent: string, type: string) => {
    // childId optional sesuai kebutuhan (pk, ls)
    let agentTitle = '';
    let agentTypeTitle = '';
    let fieldData = [];

    if (agentType === 'facility') {
      agentTitle = 'Facility Agent';
      agentTypeTitle = 'Jenis Facility Agent';
      fieldData = watchFields?.facilityAgentList;
    } else if (agentType === 'account') {
      agentTitle = 'Account Agent';
      agentTypeTitle = 'Jenis Account Agent';
      fieldData = watchFields?.accountAgentList;
    } else {
      agentTitle = 'Security Agent';
      agentTypeTitle = 'Jenis Security Agent';
      fieldData = watchFields?.securityAgentList;
    }

    const createProps: ModalAddAgentProps = {
      addData: (agentName, agentType) => {
        editData(index, agentName, agentType);
      },
      fieldData,
      initialData: {
        agentName: agent,
        agentType: type,
      },
      label1: agentTypeTitle,
      label2: agentTitle,
      title: `Add ${agentTitle}`,
    };
    NiceModal.show(modal.MODAL_ADD_AGENT, createProps);
  };

  const tableHeaderUploadDocument: Array<TableHeader> = useMemo(() => {
    if (agentType === 'facility') return [
      ...TABLE_HEADER_FACILITY_AGENT_TABLE,
      {
        key: 'action',
        label: !isReadOnly ? 'Action' : '',
        options: [
          {
            iconName: 'edit',
            isHidden: isReadOnly,
            onClick: (data, index) => {handleOpenModalEditAgent(index, data.agentLabel, data.agentType);},
          },
          {
            iconName: 'delete',
            isHidden: isReadOnly,
            onClick: (_, index) => {handleDeleteAgent(index);},
          }
        ],
        sx: {
          maxWidth: '2vw',
          minWidth: '1vw',
        },
        type: 'action',
      }
    ];

    if (agentType === 'account') return [
      ...TABLE_HEADER_ACCOUNT_AGENT_TABLE,
      {
        key: 'action',
        label: !isReadOnly ? 'Action' : '',
        options: [
          {
            iconName: 'edit',
            isHidden: isReadOnly,
            onClick: (data, index) => {handleOpenModalEditAgent(index, data.agentLabel, data.agentType);},
          },
          {
            iconName: 'delete',
            isHidden: isReadOnly,
            onClick: (_, index) => {handleDeleteAgent(index);},
          }
        ],
        sx: {
          maxWidth: '2vw',
          minWidth: '1vw',
        },
        type: 'action',
      }
    ];

    if (agentType === 'security') return [
      ...TABLE_HEADER_SECURITY_AGENT_TABLE,
      {
        key: 'action',
        label: !isReadOnly ? 'Action' : '',
        options: [
          {
            iconName: 'edit',
            isHidden: isReadOnly,
            onClick: (data, index) => {handleOpenModalEditAgent(index, data.agentLabel, data.agentType);},
          },
          {
            iconName: 'delete',
            isHidden: isReadOnly,
            onClick: (_, index) => {handleDeleteAgent(index);},
          }
        ],
        sx: {
          maxWidth: '2vw',
          minWidth: '1vw',
        },
        type: 'action',
      }
    ];
  }, [agentType]
  );
  return {
    handleOpenModalUploadDocument,
    tableHeaderUploadDocument,
    theme,
  };
};
export default useAgentTable;
