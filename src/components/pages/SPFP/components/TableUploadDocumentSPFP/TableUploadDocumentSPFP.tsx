import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { toDateString } from '@/helpers/date';
import { downloadFile } from '@/helpers/utils';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import ModalUploadDocumentExisting from '@/components/shared/SmiModal/ModalUploadDocumentExisting';
import ModalDetailUploadDocument from '@/components/shared/SmiTable/TableUploadDocumentRisalahRapat/components/ModalDetailUploadDocument';
import { modal, TABLE_HEADER } from '@/components/shared/SmiTable/ViewAllDocument/constants';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import { useTableUploadDocumentSPFP } from './TableUploadDocumentSPFP.hook';

import type { TableUploadDocumentSPFPProps } from './TableUploadDocumentSPFP.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableUploadDocumentSPFP = (props: TableUploadDocumentSPFPProps) => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const isDpop = state.userData.user.division?.some((division) => division.divisionCode.includes('DPOP')) || false;

  const {
    changeMemoLoading,
    changeMemoList,
    changeMemoPage,
    isDeleteLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    shouldDisable,
  } = useTableUploadDocumentSPFP(props);

  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);
  const isDisabled = isDeleteLoading || isSuperAdmin || !props?.showButton;

  const tableHeaderMemo: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'createdBy',
      label: 'Created By',
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.createdDate ? toDateString(row?.createdDate) : '-'}
        </TextStyle>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: (row) => viewOnly || isDpop ? [
        { iconName: 'preview-document',
          isDisabled: isDeleteLoading,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: isDeleteLoading,
          onClick: (row) => downloadFile(row.document, row.fileName),
        },
      ] : [
        {
          iconName: 'edit',
          isDisabled: isDisabled || row.hasSubmitted,
          onClick: (row) => handleOpenEditModal(row.id),
        },
        {
          iconName: 'delete',
          isDisabled: isDisabled || row.hasSubmitted,
          onClick: (row) => handleOpenDeleteModal(row.id),
        },
        { iconName: 'preview-document',
          isDisabled: isDeleteLoading,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: isDeleteLoading,
          onClick: (row) => downloadFile(row.document, row.fileName),
        }
      ],
      sx: {
        width: '12%',
      },
      type: 'action',
    },
  ];

  return (
    <>
      <SectionTitle title={props.title} isOpen sx={{ mb: 3 }}>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderMemo}
            tableData={changeMemoList}
            isLoading={changeMemoLoading}
            currentPage={noPage}
            totalPage={changeMemoPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={props?.showButton && !props?.shouldDisable ? <TableFooter onClick={handleOpenAddModal} /> : null}
          />
        </BaseContainer>
      </SectionTitle>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_EXISTING}
        component={ModalUploadDocumentExisting}
      />
      <ModalDef
        id={modal.DOCUMENT_DETAIL}
        component={ModalDetailUploadDocument}
      />
    </>
  );
};

export default TableUploadDocumentSPFP;
