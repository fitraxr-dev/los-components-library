'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import DigitalMemoDraftModal from './components/DigitalMemoDraftModal';
import { useDigitalMemoDraftTable } from './DigitalMemoDraftTable.hook';
import { modal } from './DigitmalMemoDraftTable.contants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const DigitalMemoDraftTable = () => {
  const viewOnly = false;
  const {
    noPage,
    setNoPage,
    setItemPerPage,
    handleOpenAddModal,
    handleDeleteDraft,
    attachmentListContents,
    attachmentListPage,
    attachmenListLoading,
    deleteAttachmentLoading,
  } = useDigitalMemoDraftTable();

  const tableHeaderDigitalMemo: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '55px',
      },
      type: 'index',
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      render: (row, index) => (
        <Input
          key={index}
          type="dropdown"
          placeholder="Pilih Jenis Dokumen"
          value={`${row.documentType};${row.documentName};${row.documentNumber};`}
          dropdownList={[{
            label: `${row.documentType};${row.documentName};${row.documentNumber};`,
            value: `${row.documentType};${row.documentName};${row.documentNumber};`,
          }]}
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: (props) => [
        {
          iconName: 'delete',
          onClick: (data) => {
            handleDeleteDraft(data.documentType.value);
          },
          // isDisabled: deleteAttachmentLoading || props.viewOnly || viewOnly,
        },
      ],
      sx: {
        width: '68px',
      },
      type: 'action',
    },
  ];

  // const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  // const isViewOnly = viewOnly || (isKadivTL && viewOnly);
  const isViewOnly = viewOnly;

  return (
    <>
      <SectionTitle title="Digital Memo" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderDigitalMemo}
          tableData={attachmentListContents}
          isLoading={attachmenListLoading}
          currentPage={noPage}
          totalPage={attachmentListPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={!isViewOnly && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
        />
      </BaseContainer>

      <ModalDef
        id={modal.DIGITAL_MEMO_DRAFT}
        component={DigitalMemoDraftModal}
      />
    </>
  );
};

export default DigitalMemoDraftTable;
