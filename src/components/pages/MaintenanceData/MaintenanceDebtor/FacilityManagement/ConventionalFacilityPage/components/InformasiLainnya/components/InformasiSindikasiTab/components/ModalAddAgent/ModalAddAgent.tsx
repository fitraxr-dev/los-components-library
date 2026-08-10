import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Box from '@mui/material/Box';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalAddAgent.constant';
import useModalAddAgent from './ModalAddAgent.hook';

import type { ModalAddAgentProps } from './ModalAddAgent.type';


const ModalAddAgent = NiceModal.create((props: ModalAddAgentProps) => {
  const { title, label1, label2, addData, initialData, fieldData } = props;
  const modalId = modal.MODAL_ADD_AGENT;
  const { visible } = useModal(modalId);

  const {
    agent,
    agentType,
    bankTypeOptions,
    byValue,
    filteredAgents,
    setAgent,
    setAgentType,
  } = useModalAddAgent({ agentName: initialData?.agentName, fieldData, type: initialData?.agentType });

  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper gap={3} sx={{ width: '100%' }} justifyContent="space-between">
          <Box sx={{ width: '-webkit-fill-available' }}>
            <Autocomplete
              placeholder={`Choose ${label1}`}
              label={label1}
              dropdownList={bankTypeOptions}
              onChange={(val) => {
                setAgentType(val?.id as string);
              }}
              value={byValue(agentType, bankTypeOptions)}
            />
          </Box>

          <Box sx={{ width: '-webkit-fill-available' }}>
            <Autocomplete
              label={label2}
              placeholder={`Choose ${label2}`}
              dropdownList={filteredAgents}
              disabled={!agentType}
              onChange={(e) => setAgent(e?.id as string)}
              value={byValue(agent, filteredAgents)}
            />
          </Box>
        </RowWrapper>

        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
          <Button
            disabled={!agent}
            onClick={() => addData(agent, agentType)}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});
export default ModalAddAgent;
