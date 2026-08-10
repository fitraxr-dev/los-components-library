import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../ListPage/List.constants';

import { useFormMasterModal } from './FormMasterModal.hook';


const FormMasterModal = NiceModal.create((props: any) => {
  const modalId = modal.APPROVAL_MASTER_MODAL;
  const theme = useTheme();
  const { visible } = useModal(modalId);
  const isMandatoryEmpty = false; //dummy

  const {
    isSaveLoading,
    handleOnSave,
    masintonChange,
    masintonForm,
  } = useFormMasterModal(props);

  const {
    lovCode,
    lovDescription,
    ariumCode,
    temenosCode,
    active,
  } = masintonForm;

  return (
    <SectionModal
      title={`${props?.title} Master Tipe Permohonan`}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '30vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Input
          label="LOV_CODE"
          type="text"
          value={lovCode.value}
          // disabled={true}
        />
        <Input
          label="LOV_DESCRIPTION"
          type="text"
          // disabled={true}
          value={lovDescription.value}
          // onChange={(val) => {masintonChange('lovDescription', val);}}
        />
        <Input
          label="ARIUM_CODE"
          type="text"
          // disabled={true}
          value={ariumCode.value}
        />
        <Input
          label="TEMENOS_CODE"
          type="text"
          // disabled={true}
          value={temenosCode.value}
        />
        <Input
          label="Active"
          type="radio"
          value={active.value}
          radioList={[
            {
              label: 'Ya',
              value: true,
            },
            {
              label: 'Tidak',
              value: false,
            },
          ]}
          containerSx={{ flex: 1 }}
        />
        <RowWrapper py={3} gap={2} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
            disabled={isSaveLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isMandatoryEmpty || isSaveLoading}
            onClick={() => handleOnSave(props)}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default FormMasterModal;
