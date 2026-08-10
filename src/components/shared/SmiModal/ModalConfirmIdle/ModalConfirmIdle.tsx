'use client';
import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import Button from '../../Button';
import ColumnWrapper from '../../ColumnWrapper';
import Icon from '../../Icon';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';
import VStack from '../../VStack';
import SectionModal from '../SectionModal';

import { MODAL_CHECK_IDLE } from './ModalConfirmIdle.constants';
import useModalConfirmIdle from './ModalConfirmIdle.hook';

import type { ModalConfirmIdleProps } from './ModalConfirmIdle.types';


const ModalConfirmIdle = create((props: ModalConfirmIdleProps) => {
  const modalId = MODAL_CHECK_IDLE;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    handleOnForceLogout,
    onClose,
    counter,
  } = useModalConfirmIdle(props);

  return (
    <SectionModal
      isOpen={visible}
      onClose={onClose}
      customFooter={() => null}
      containerSx={{
        width: '25vw',
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
            Sesi akan berakhir dalam {counter} detik – klik 'Lanjutkan' untuk tetap login.
          </TextStyle>
        </VStack>
        <RowWrapper
          sx={{
            gap: theme.spacing(2),
          }}
        >
          <Button
            variant="outlined"
            isFull
            onClick={handleOnForceLogout}
          >
            Logout
          </Button>
          <Button
            isFull
            onClick={onClose}
          >
            Lanjutkan
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalConfirmIdle;
