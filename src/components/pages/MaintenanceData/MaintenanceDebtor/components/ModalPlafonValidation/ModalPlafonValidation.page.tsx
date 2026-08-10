'use client';

import NiceModal from '@ebay/nice-modal-react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import { modal } from '../ActionFooterDetail/ActionFooterDetail.constant';

import useModalPlafonValidation from './ModalPlafonValidation.hook';


const ModalAddStructure = NiceModal.create((props: any) => {

  const {
    modal,
    modalId,
    theme,
    handleOpenBcmError,
  } = useModalPlafonValidation();
  console.log(props);

  const errorMessage = props?.errorMessage?.split(',');
  console.log(errorMessage);


  return (
    <SectionModal
      title="Plafon Validation"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '32vw' }}
      onConfirm={() => {
        closeNiceModal(modalId);
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
            iconName="error"
            sx={{
              color: theme.palette.error.main,
              fontSize: theme.spacing(12),
            }}
          />
          <TextStyle
            variant="display2"
            color={theme.palette.custom.softRed}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            Plafon Validation
          </TextStyle>

          <Box
            sx={{
            //   paddingLeft: theme.spacing(2),
            //   paddingRight: theme.spacing(2),
              textAlign: 'center',
              width: '100%',
            }}
          >
            <TextStyle
              sx={{ marginBottom: theme.spacing(2) }}
            >
              Total fasilitas pada beberapa pengajuan tidak sesuai dengan nominal PK.
            </TextStyle>
            <br />
            <TextStyle
              sx={{ marginBottom: theme.spacing(2) }}
            >
              Silakan sesuaikan terlebih dahulu:
            </TextStyle>
            <ul style={{ listStyleType: 'none', margin: 0, paddingLeft: 0 }}>
              <li>
                <TextStyle>
                  {errorMessage?.map((item) => (
                    <>
                      <a
                        key={item}
                        onClick={() => handleOpenBcmError(item.split('|')[1])}
                        style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {item.replace('|', ' | ')}
                      </a>
                      <br />
                    </>
                  ))}
                </TextStyle>
              </li>
            </ul>
          </Box>
        </VStack>

        <Button
          variant="outlined"
          isFull
          onClick={() => {
            closeNiceModal(modalId);
          }}
        >
          Close
        </Button>
      </ColumnWrapper>
    </SectionModal>

  );
},
);

export default ModalAddStructure;
