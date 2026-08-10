'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableUploadDocumentRisalahRapat from '@/components/shared/SmiTable/TableUploadDocumentRisalahRapat';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import ModalAddFinalDocument from '../Modals/ModalAddFinalDocument';
import ModalDetailFinalDocument from '../Modals/ModalDetailFinalDocument';

import useTabDiscussion from './TabDiscussion.hook';


const TabDiscussion = () => {
  const { viewOnly } = useViewOnly();

  const {
    handleOpenAddFinalDocumentModal,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTabDiscussion();

  return (
    <>
      <ColumnWrapper gap={6}>
        <SectionTitle title="Risalah Rapat Final" isOpen>
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
              footer={!viewOnly && <TableFooter onClick={handleOpenAddFinalDocumentModal} />}
            />
          </BaseContainer>
        </SectionTitle>

        <TableUploadDocumentRisalahRapat
          title="Upload Lampiran Document"
          process={TypeProcess.RISALAH_RAPAT}
          module={TypeModule.RISALAH_RAPAT}
        />
      </ColumnWrapper>

      <ModalDef id={MODAL.RISALAH_RAPAT.ADD_FINAL_DOCUMENT} component={ModalAddFinalDocument} />
      <ModalDef id={MODAL.RISALAH_RAPAT.DETAIL_FINAL_DOCUMENT} component={ModalDetailFinalDocument} />
    </>
  );
};

export default TabDiscussion;
