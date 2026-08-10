'use client';
import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../Rating/Rating.constants';

import useModalHistoryRating from './ModalHistoryRating.hook';


const ModalHistoryRating = create(() => {
  const modalId = modal.HISTORY_RATING;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    tableHeader,
    tableData,
  } = useModalHistoryRating();

  return (
    <SectionModal
      containerSx={{ minWidth: '65vw' }}
      isOpen={visible}
      customFooter={() => {}}
    >
      <SectionTitle title="History Rating" />
      <BaseContainer
        sx={{
          boxShadow: 7,
          marginBottom: theme.spacing(3),
        }}
      >
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
        />
      </BaseContainer>
      <RowWrapper justifyContent="end">
        <Button
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalHistoryRating;
