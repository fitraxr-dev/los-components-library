'use client';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalDetail from './ModalDetail.hook';

import type { ModalDetailProps } from './ModalDetail.types';


const ModalDetail = create((props: ModalDetailProps) => {
  const modalId = MODAL.REPORT.BMPP_GROUP_DETAIL;
  const modal = useModal(modalId);
  const theme = useTheme();

  const {
    isLoadingExisting,
    isLoadingProposed,
    pageExisting,
    pageProposed,
    pageSizeExisting,
    pageSizeProposed,
    setPageExisting,
    setPageProposed,
    setPageSizeExisting,
    setPageSizeProposed,
    tableHeaderProposed,
    tableDataProposed,
    totalPageProposed,
    tableHeaderExisting,
    tableDataExisting,
    totalPageExisting,
  } = useModalDetail(props);

  return (
    <SectionModal
      title="Detail BMPP Group"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '80vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <SectionTitle title="List Fasilitas Usulan" isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isLoadingProposed}
              tableHeader={tableHeaderProposed}
              tableData={tableDataProposed}
              currentPage={pageProposed}
              totalPage={totalPageProposed}
              handlePageChange={setPageProposed}
              pageSize={pageSizeProposed}
              onPageSizeChange={setPageSizeProposed}
            />
          </BaseContainer>
        </SectionTitle>

        <SectionTitle title="List Fasilitas Existing" isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isLoadingExisting}
              tableHeader={tableHeaderExisting}
              tableData={tableDataExisting}
              currentPage={pageExisting}
              totalPage={totalPageExisting}
              handlePageChange={setPageExisting}
              pageSize={pageSizeExisting}
              onPageSizeChange={setPageSizeExisting}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDetail;
