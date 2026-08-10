import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '../../Button';
import ColumnWrapper from '../../ColumnWrapper';
import Icon from '../../Icon';
import { noop } from '../../Input/components/Number/utils';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';
import VStack from '../../VStack';
import ModalTransition from '../ModalTransition';


const ModalDirty = create(({
  title = 'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.',
  onClose = noop,
  onSubmit = noop,
  submitText = 'Ya',
  closeText = 'Tidak',
}: ModalDirtyProps) => {
  const theme = useTheme();
  const modalId = MODAL.IS_DIRTY;
  const modal = useModal(modalId);

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => {
        onClose();
        closeNiceModal(modalId);
      }}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(4),
          width: theme.spacing(58.75),
        },
      }}
    >
      <ColumnWrapper
        sx={{
          gap: theme.spacing(4),
          justifyContent: 'space-between',
        }}
      >
        <VStack style={{ gap: theme.spacing(2) }} align="center">
          <Icon
            iconName="warning"
            sx={{
              color: theme.palette.warning.main,
              fontSize: theme.spacing(8.25),
            }}
          />
          <TextStyle
            variant="display2"
            color={theme.palette.custom.lightYellow}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            Warning!!
          </TextStyle>
          <TextStyle sx={{ textAlign: 'center' }}>
            {title}
          </TextStyle>
        </VStack>
        <RowWrapper
          sx={{
            gap: theme.spacing(2),
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            isFull
            onClick={() => {
              onClose();
              closeNiceModal(modalId);
            }}
          >
            {closeText}
          </Button>
          <Button
            variant="outlined"
            isFull
            onClick={() => {
              onSubmit();
              closeNiceModal(modalId);
            }}
          >
            {submitText}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default ModalDirty;
