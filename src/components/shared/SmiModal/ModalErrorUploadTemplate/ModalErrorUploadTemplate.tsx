import React, { useState, useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import type { ModalErrorUploadTemplateProps } from './ModalErrorUploadTemplate.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MODAL_ERROR_UPLOAD_TEMPLATE = 'MODAL_ERROR_UPLOAD_TEMPLATE';

const ModalErrorUploadTemplate = NiceModal.create(({
  title = 'Detail Message',
  data = [],
  ...props
}: ModalErrorUploadTemplateProps) => {
  const modalId = props.modalId || MODAL_ERROR_UPLOAD_TEMPLATE;
  const { visible } = useModal(modalId);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableHeader: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'rowNumber',
      label: 'Row Number',
    },
    {
      key: 'errorMessage',
      label: 'Error Message',
    },
  ];

  const totalPage = Math.ceil((data?.length || 0) / pageSize) || 1;

  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const handleClose = () => {
    closeNiceModal(modalId);
  };

  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={handleClose}
      customFooter={() => null}
      containerSx={{
        minWidth: '50vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Table
          tableHeader={tableHeader}
          tableData={paginatedData}
          currentPage={currentPage}
          totalPage={totalPage}
          handlePageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          isPaper
        />
        <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalErrorUploadTemplate;
