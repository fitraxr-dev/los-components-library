import { ModalDef } from '@ebay/nice-modal-react';

import Table from '@/components/shared/Table';

import ModalDetailUploadDocument from '../TableUploadDocumentCc/components/ModalDetailUploadDocument';
import { modal } from '../ViewAllDocument/constants';

import useTableDocumentCreditCheckingResult from './TableDocumentCreditCheckingResult.hook';

import type { TableDocumentCreditChekingResultProps } from './TableDocumentCreditCheckingResult.types';


const TableDocumentCreditCheckingResult = (props: TableDocumentCreditChekingResultProps) => {
  const {
    isFetching,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    totalPage,
  } = useTableDocumentCreditCheckingResult(props);

  return (
    <>
      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        isLoading={isFetching}
        currentPage={noPage}
        totalPage={totalPage}
        handlePageChange={setNoPage}
        onPageSizeChange={setItemPerPage}
      />

      <ModalDef
        id={modal.DOCUMENT_DETAIL}
        component={ModalDetailUploadDocument}
      />
    </>
  );
};

export default TableDocumentCreditCheckingResult;
