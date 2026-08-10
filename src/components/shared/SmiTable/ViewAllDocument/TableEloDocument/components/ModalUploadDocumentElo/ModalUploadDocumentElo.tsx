import * as React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL_UPLOAD_DOCUMENT_ELO } from '../../TableEloDocument.constants';

import FormAddNew from './FormAddNew';
import FormSelectTable from './FormSelectTable';
import useModalUploadDocumentELO from './ModalUploadDocumentElo.hook';

import type { ModalUploadDocumentEloProps } from './ModalUploadDocumentElo.types';


const ModalUploadDocumentElo = create((props: ModalUploadDocumentEloProps) => {
  const modalId = MODAL_UPLOAD_DOCUMENT_ELO;
  const { visible } = useModal(modalId);

  const {
    isViewAllDocument,
    debiturName,
    documentGroupData,
    documentTypeData,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    generateTitle,
    documentDetailData,
    selected,
    setSelected,
    existingDocuments,
  } = useModalUploadDocumentELO(props);

  const {
    document,
    documentCategory,
    documentDate,
    documentGroup,
    documentName,
    documentNumber,
    documentType,
  } = masintonForm;

  const isMandatoryEmpty = props?.isExistingMode
    ? selected.length === 0 // For existing mode, check if no documents are selected
    : !document.value ||
      !documentCategory.value ||
      !documentGroup.value ||
      !documentType.value ||
      !documentNumber.value ||
      !documentDate.value ||
      !documentName.value; // For new document mode, check all required fields

  return (
    <SectionModal
      title={`${generateTitle(+props.id)} ELO`}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {props.isExistingMode ? (
          <FormSelectTable
            onSelected={setSelected}
            module={props.module}
            process={props.process}
            existingDocuments={existingDocuments}
          />
        ) : (
          <FormAddNew
            isViewAllDocument={isViewAllDocument}
            documentGroupData={documentGroupData}
            documentTypeData={documentTypeData}
            isFetchDocumentGroupLoading={isFetchDocumentGroupLoading}
            isFetchDocumentTypeLoading={isFetchDocumentTypeLoading}
            masintonChange={masintonChange}
            masintonMultiChange={masintonMultiChange}
            masintonForm={masintonForm}
            setKeyworDocumentGroup={setKeyworDocumentGroup}
            setKeyworDocumentType={setKeyworDocumentType}
            debiturName={debiturName}
            documentDetailData={documentDetailData}
          />
        )}

        <RowWrapper justifyContent="end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isMandatoryEmpty || isSaveLoading}
            isLoading={isSaveLoading}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalUploadDocumentElo;
