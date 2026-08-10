import React, { useState } from 'react';

import NiceModal, { create, useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ModalTransition from '../ModalTransition';

import type { ModalWatermarkProps } from './ModalWatermark.types';


const ModalWatermark = create((props: ModalWatermarkProps) => {
  const modalId = MODAL.GLOBAL.WATERMARK;
  const data = props;
  const theme = useTheme();

  const [value, setValue] = useSessionStorage('watermark', '');
  const initialValue = value || props.initialWatermark || '';
  const [radioValue, setRadioValue] = useState(!!initialValue ? 'watermark' : 'default');

  const modal = useModal(modalId);


  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          maxHeight: '60vh',
          maxWidth: '73vw',
          minWidth: '60vw',
          padding: theme.spacing(4),
        },
      }}
    >
      <RowWrapper
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.custom.gray30,
          borderWidth: '0.02vw',
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.primary.main}
          sx={{
            py: 2,
          }}
        >
          Setting Watermark
        </TextStyle>
      </RowWrapper>

      <Input
        type="radio"
        value={radioValue}
        onChange={(e) => {
          setRadioValue(e.target.value);
        }}
        radioList={
          [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Custom Watermark',
              value: 'watermark',
            },
          ]
        }
        defaultValue={radioValue}
        sx={{ flex: 1, mb: 4 }}
      />

      {radioValue === 'watermark' && (
        <Input
          type="area"
          label="Custom Watermark"
          placeholder="Input Custom Watermark"
          rows={6}
          maxLength={150}
          multiline
          isMandatory
          value={value}
          helperText={ value.length === 150 ? 'Max 150 characters' : ''}
          onChange={(val) => setValue(val)}
        />
      )}


      <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => data.onSave({
            radioValue,
            watermark: radioValue === 'watermark' ? value : '',
          })}
          color="primary"
          disabled={ radioValue !== 'default' && !value}
          isLoading={data.isLoading}
        >
          Save
        </Button>
      </RowWrapper>
    </Dialog>
  );


});
export default ModalWatermark;
