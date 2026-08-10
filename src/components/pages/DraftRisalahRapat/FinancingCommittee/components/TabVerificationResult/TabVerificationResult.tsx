import { ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';

import ModalConsentSheet from '../Modals/ModalConsentSheet';
import ModalConsentSheetSection from '../Modals/ModalConsentSheetSection';
import ModalConsentSheetSigning from '../Modals/ModalConsentSheetSigning';
import ModalManualSignDocument from '../Modals/ModalManualSignDocument';
import ModalMergeDocument from '../Modals/ModalMergeDocument';
import ModalSendToSPFP from '../Modals/ModalSendToSPFP';
import TableMergeDocument from '../Tables/TableMergeDocument';
import TableSignedDocument from '../Tables/TableSignedDocument';

import useTabVerificationResult from './TabVerificationResult.hook';


const TabVerificationResult = () => {
  const {
    containsSigner,
    handleClose,
    handleOpenConsentSheetModal,
    handleOpenMergeDocumentModal,
    handleOpenSendToSPFPModal,
    isSignerCountLoading,
    isStepperCompleted,
    isBucketProcessCompleted,
    isTaskForce,
    isKadiv,
    isTL,
    navigateToAcknowledgementSheetPreview,
  } = useTabVerificationResult();

  return (
    <>
      <ColumnWrapper gap={3}>
        <RowWrapper gap={2}>
          <Button
            variant="contained"
            startIcon="add-2"
            onClick={handleOpenConsentSheetModal}
          >
            Lembar persetujuan
          </Button>
          <Button
            variant="contained"
            startIcon="show"
            onClick={navigateToAcknowledgementSheetPreview}
          >
            Preview Lembar persetujuan
          </Button>
        </RowWrapper>

        <SectionTitle
          title="Merge Dokumen Risalah Rapat"
          isOpen
          buttons={[{
            color: 'success',
            disabled: !containsSigner || isBucketProcessCompleted,
            isLoading: isSignerCountLoading,
            label: 'Merge Dokumen',
            onClick: handleOpenMergeDocumentModal,
          }]}
        >
          <TableMergeDocument />
        </SectionTitle>

        <SectionTitle title="Dokumen Risalah Rapat Yang Sudah Ditandatangani" isOpen>
          <TableSignedDocument />
        </SectionTitle>

        <RowWrapper gap={2} alignItems="center" justifyContent="end">
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>

          {!(isTaskForce || isKadiv || isTL) && (
            <Button
              variant="contained"
              isLoading={isSignerCountLoading}
              disabled={!isStepperCompleted}
              onClick={handleOpenSendToSPFPModal}
            >
              Send to SPFP
            </Button>
          )}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef id={MODAL.RISALAH_RAPAT.CONSENT_SHEET_LIST} component={ModalConsentSheet} />
      <ModalDef id={MODAL.RISALAH_RAPAT.CONSENT_SHEET_SECTION} component={ModalConsentSheetSection} />
      <ModalDef id={MODAL.RISALAH_RAPAT.CONSENT_SHEET_USER} component={ModalConsentSheetSigning} />
      <ModalDef id={MODAL.RISALAH_RAPAT.MERGE_DOCUMENT} component={ModalMergeDocument} />
      <ModalDef id={MODAL.RISALAH_RAPAT.SEND_TO_SPFP} component={ModalSendToSPFP} />
      <ModalDef id={MODAL.RISALAH_RAPAT.MANUAL_SIGN_DOCUMENT} component={ModalManualSignDocument} />
    </>
  );
};

export default TabVerificationResult;
