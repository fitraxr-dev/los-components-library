import { create, useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


const EditProjectPhase = create(() => {
  const modalId = 'EDIT_PROJECT_PHASE';
  const modal = useModal(modalId);

  return (
    <SectionModal
      title="Edit Project Phase"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        minWidth: '52vw',
        'scrollbar-width': 'none',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input label="Name Project Phase" />
        <Input type="date" label="Status As Of" />
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => closeNiceModal(modalId)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default EditProjectPhase;
