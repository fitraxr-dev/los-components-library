import React from 'react';

import { create } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL } from '../../../RisalahRapatResult.contants';

import useDivisionModal from './DivisionModal.hook';

import type { DivisionModalProps } from './DivisionModal.types';


const DivisionModal = create((props: DivisionModalProps) => {

  const {
    checkboxDivisi,
    setCheckboxDivisi,
    handleSubmitDivision,
    modal,
    mode,
    theme,
    divisions,
    modalId,
  } = useDivisionModal(props);

  return (
    <SectionModal
      title={`${mode} Divisi`}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        minWidth: '25vw',
        'scrollbar-width': 'none',
      }}
    >
      <Input
        type="checkbox"
        checkboxList={divisions}
        value={checkboxDivisi}
        onChange={(val) => {
          setCheckboxDivisi(val);
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        }}
      />
      <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 4 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>Cancel</Button>
        <Button color="primary" onClick={handleSubmitDivision}>Save</Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default DivisionModal;
