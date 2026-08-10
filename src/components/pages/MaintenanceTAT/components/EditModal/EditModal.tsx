import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../ListPage/List.constants';


const EditModal = NiceModal.create((props: any) => {
  const modalId = modal.EDIT_MODAL;
  const { visible } = useModal(modalId);
  const [isNeedExtra, setIsNeedExtra] = useState([]);
  const [isActive, setIsActive] = useState('');

  return (
    <SectionModal
      title={props.title}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input
          type="time"
          value={props.endOfDay}
          onChange={(val) => {
            console.log(val);
          }}
        />
        <RowWrapper gap={3} alignItems="flex-end">
          <ColumnWrapper
            gap={2}
            paddingRight={2}
            sx={{
              borderRight: '1px solid #ABABAB',
            }}
          >
            <TextStyle variant="body4" weight={600}>Need Extra</TextStyle>
            <Input
              disabled={false}
              type="checkbox"
              value={isNeedExtra}
              onChange={(data) => {
                setIsNeedExtra(data);
              }}
              checkboxList={[
                { label: 'Ya', value: 'YA' },
              ]}
            />
          </ColumnWrapper>
          <Input
            type="time"
            disabled={isNeedExtra[0] !== 'YA'}
            onChange={(val) => {
              console.log(val);
            }}
            containerSx={{
              flexGrow: 1,
            }}
          />
        </RowWrapper>
        <ColumnWrapper>
          <TextStyle variant="body4" weight={600}>Active</TextStyle>
          <Input
            disabled={false}
            type="radio"
            value={isActive}
            radioList={[
              { label: 'Ya', value: 'YA' },
              { label: 'Tidak', value: 'TIDAK' },
            ]}
            onChange={(val) => {
              setIsActive(val.target.defaultValue);
            }}
          />
        </ColumnWrapper>
        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default EditModal;
