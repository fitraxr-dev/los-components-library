'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { modal } from './AdditionalInformation.constant';
import { useAdditionalInformation } from './AdditionalInformation.hook';
import ModalDecline from './components/ModalDecline';


const AdditionalInformationPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    container,
    setContainer,
    handleSave,
    additionalInfoDetail,
    isSubmitting,
    viewOnly,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    handleOpenDeclineModal,
    isDetailLoading,
    renderActionButtons,
  } = useAdditionalInformation();

  const renderButton = () => {
    if (viewOnly) {
      return (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => router.push(mup.LIST_PAGE)}
          >
            Close
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          onClick={handleSave}
          disabled={isSubmitting || isDetailLoading}
          isLoading={isSubmitting}
        >
          Save & Next
        </Button>
        {...renderActionButtons()}
      </>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Additional Information" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <RowWrapper marginBottom={theme.spacing(8)}>
        <WordEditor
          id="additional"
          isLoading={isSubmitting}
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          initialValue={additionalInfoDetail?.description}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </RowWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        {renderButton()}
      </RowWrapper>
      <ModalDef
        id={modal.DECLINE}
        component={ModalDecline}
      />
    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
