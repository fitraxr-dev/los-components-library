'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import { MODAL } from '@/configs/constants/modalId';
import { mupAnalyst } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ModalDecline from './components/ModalDecline';
import { useExtraInformation } from './ExtraInformation.hook';


const ExtraInformationPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();

  const {
    descriptionContainer,
    setDescriptionContainer,
    handleOpenDeclineModal,
    handleSave,
    handleOpenSubmitModal,
    detailExtraInformation,
    isDetailLoading,
    isSubmitLoading,
    isSaveLoading,
    renderActionButtons,
  } = useExtraInformation();

  const renderButton = () => {
    if (viewOnly) {
      return (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => router.push(mupAnalyst.LIST_PAGE)}
          >
            Close
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          variant="outlined"
          color="error"
          onClick={handleOpenDeclineModal}
          disabled={isSaveLoading || isDetailLoading}
        >
          Decline
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaveLoading || isDetailLoading}
          isLoading={isSaveLoading}
        >
          Save
        </Button>
        {...renderActionButtons()}
      </>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Informasi Tambahan Lainnya" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <RowWrapper marginBottom={theme.spacing(3)}>
        <WordEditor
          isLoading={isSaveLoading || isDetailLoading || isSubmitLoading}
          isReadOnly={viewOnly}
          container={descriptionContainer}
          setContainer={setDescriptionContainer}
          initialValue={detailExtraInformation?.description}
        />
      </RowWrapper>

      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {renderButton()}
      </RowWrapper>

      <ModalDef
        id={MODAL.DECLINE}
        component={ModalDecline}
      />
    </ColumnWrapper>
  );
};

export default ExtraInformationPage;
