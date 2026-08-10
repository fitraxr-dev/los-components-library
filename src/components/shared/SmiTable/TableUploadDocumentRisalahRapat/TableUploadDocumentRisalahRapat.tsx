import { ModalDef } from '@ebay/nice-modal-react';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import ModalUploadDocument from '../../SmiModal/ModalUploadDocument';
import TableFooter from '../../TableFooter';

import ModalDetailUploadDocument from './components/ModalDetailUploadDocument';
import { modal } from './TableUploadDocumentRisalahRapat.constant';
import useTableUploadDocumentRisalahRapat from './TableUploadDocumentRisalahRapat.hook';


interface TableUploadDocumentRisalahRapatProps {
  module: string;
  process: string;
  childId?: string;
  title?: string;
}

const TableUploadDocumentRisalahRapat = ({
  module,
  process,
  childId,
  title = 'Upload Dokumen',
}: TableUploadDocumentRisalahRapatProps) => {
  const { viewOnly } = useViewOnly();

  const {
    handleOpenAddDocumentModal,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTableUploadDocumentRisalahRapat({ childId, module, process });

  return (
    <>
      <SectionTitle title={title} isOpen>
        <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            footer={!viewOnly && <TableFooter onClick={handleOpenAddDocumentModal} />}
          />
        </BaseContainer>
      </SectionTitle>

      <ModalDef id={modal.MODAL_UPLOAD_DOCUMENT} component={ModalUploadDocument} />
      <ModalDef id={modal.DOCUMENT_DETAIL} component={ModalDetailUploadDocument} />
    </>
  );
};

export default TableUploadDocumentRisalahRapat;
