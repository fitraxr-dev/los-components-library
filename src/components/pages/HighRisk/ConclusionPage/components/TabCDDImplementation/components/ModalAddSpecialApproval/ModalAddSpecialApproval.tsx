'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TabCDDImplementation.constants';

import useModalAddSpecialApproval from './ModalAddSpecialApproval.hook';


const ModalSpecialApproval = NiceModal.create((props: ModalAddSpecialApprovalProps) => {
  const { id, specialApprovalOptions } = props;
  const theme = useTheme();
  const modalId = modal.ADD_SPECIAL_APPROVAL;
  const { visible } = useModal(modalId);

  const {
    setSelectedSpecialApproval,
    selectedSpecialApproval,
    handleOnSave,
    isSaveLoading,
    inputAreaValues,
    setInputAreaValues,
  } = useModalAddSpecialApproval(props);

  console.log(selectedSpecialApproval);

  return (
    <SectionModal
      isOpen={visible}
      title={`${id ? 'Edit' : 'Add New'} Persetujuan Khusus`}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{ minWidth: '28vw' }}
      customFooter={() => null}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Input
          isMandatory
          label="Persetujuan Khusus"
          type="dropdown"
          value={selectedSpecialApproval}
          dropdownList={specialApprovalOptions}
          placeholder="Choose Persetujuan Khusus"
          onChange={(val) => setSelectedSpecialApproval(val)}
        />

        {selectedSpecialApproval === 'OTHERS' && (
          <Input
            type="area"
            label="Deskripsi Other"
            placeholder="Tulis Deskripsi Other"
            rows={4}
            value={inputAreaValues.specialNotes}
            onChange={(value) => setInputAreaValues((prev) => ({
              ...prev,
              specialNotes: value,
            }))}
          />
        )}

        <Input
          type="area"
          label="Keterangan"
          placeholder="Input Keterangan"
          rows={4}
          value={inputAreaValues.description}
          onChange={(value) => setInputAreaValues((prev) => ({
            ...prev,
            description: value,
          }))}
        />
      </ColumnWrapper>

      <RowWrapper gap={theme.spacing(3)} mt={2} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          onClick={() => {
            closeNiceModal(modalId);
          }}
        >
          Cancel
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={!selectedSpecialApproval}
          onClick={handleOnSave}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default ModalSpecialApproval;
