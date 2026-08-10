import { ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';

import ModalAddFinalDocument from '../../Modals/ModalAddFinalDocument';
import ModalDetailMergeDocument from '../../Modals/ModalDetailMergeDocument';
import ModalPrivyConfiguration from '../../Modals/ModalPrivyConfiguration';
import ModalSignDocument from '../../Modals/ModalSignDocument';

import useTableMergeDocument from './TableMergeDocument.hook';


const TabelMergeDocument = () => {
  const {
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTableMergeDocument();

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

      <ModalDef id={MODAL.RISALAH_RAPAT.SIGN_DOCUMENT} component={ModalSignDocument} />
      <ModalDef id={MODAL.RISALAH_RAPAT.PRIVY_CONFIGURATION} component={ModalPrivyConfiguration} />
      <ModalDef id={MODAL.RISALAH_RAPAT.ADD_FINAL_DOCUMENT} component={ModalAddFinalDocument} />
      <ModalDef id={MODAL.RISALAH_RAPAT.DETAIL_MERGE_DOCUMENT} component={ModalDetailMergeDocument} />
    </>
  );
};

export default TabelMergeDocument;
