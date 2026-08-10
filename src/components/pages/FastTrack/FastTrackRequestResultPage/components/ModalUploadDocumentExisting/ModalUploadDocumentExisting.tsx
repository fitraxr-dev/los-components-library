import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import MultiSelectAutoComplete from '@/components/shared/MultiSelectAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from './ModalUploadDocumentExisting.constants';
import useModalUploadDocumentExisting from './ModalUploadDocumentExisting.hook';

import type { ModalUploadDocumentExistingProps } from './ModalUploadDocumentExisting.types';


const ModalUploadDocumentExisting = NiceModal.create((props: ModalUploadDocumentExistingProps) => {
  const modalId = modal.MODAL_UPLOAD_DOCUMENT_EXISTING;
  const { visible } = useModal(modalId);

  const {
    namaDocument,
    setNamaDocument,
    tableHeaderModalUploadExisting,
    categoryDocList,
    setKategoriDocument,
    kategoriDocument,
    getDropdownListFiltered,
    handleOnAdd,
    handleOnSave,
    tableData,
    isSaveLoading,
  } = useModalUploadDocumentExisting(props);

  return (
    <SectionModal
      title="Add Existing Document"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '64vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>

        <RowWrapper gap={2}>
          <MultiSelectAutoComplete
            label="Kategori Dokumen"
            sx={{ width: '30vw' }}
            value={kategoriDocument}
            disabled={props.documentCategory?.length > 0}
            onChange={(e) => setKategoriDocument(e)}
            dropdownList={categoryDocList?.data}
            placeholder="Search Kategori Dokumen.."
          />
          <MultiSelectAutoComplete
            label="Nama Dokumen"
            value={namaDocument}
            sx={{ width: '27vw' }}
            onChange={(e) => {
              if (typeof e[e.length - 1] !== 'string') {
                setNamaDocument(e);
              }
            }}
            dropdownList={getDropdownListFiltered()}
            placeholder="Search Nama Dokumen.."
          />
          <Button
            disabled={kategoriDocument?.length === 0 || namaDocument?.length === 0}
            sx={{
              alignSelf: 'flex-end',
            }}
            onClick={handleOnAdd}
          >
            Add
          </Button>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableData={tableData}
            tableHeader={tableHeaderModalUploadExisting}
          />
        </BaseContainer>


        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSaveLoading}
            onClick={handleOnSave}
            disabled={!tableData?.length}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal >
  );
});

export default ModalUploadDocumentExisting;
