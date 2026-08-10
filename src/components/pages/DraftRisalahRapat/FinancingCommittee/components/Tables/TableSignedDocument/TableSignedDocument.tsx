import { ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import ModalDetailSignedDocument from '../../Modals/ModalDetailSignedDocument';

import useTableSignedDocument from './TableSignedDocument.hook';


const TableSignedDocument = () => {
  const {
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTableSignedDocument();

  return (
    <>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          currentPage={page}
          handlePageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalPage={totalPage}
          isLoading={isLoading}
        />
      </BaseContainer>

      <ModalDef id={MODAL.RISALAH_RAPAT.DETAIL_SIGNED_DOCUMENT} component={ModalDetailSignedDocument} />
    </>
  );
};

export default TableSignedDocument;
