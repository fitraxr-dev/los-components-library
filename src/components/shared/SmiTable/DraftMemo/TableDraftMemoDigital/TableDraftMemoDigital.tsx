'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';


import ModalDraftMemoDigital from './components/ModalDraftMemoDigital';
import { modal } from './TableDraftMemoDigital.constants';
import { useTableDraftMemoDigital } from './TableDraftMemoDigital.hook';

import type { TableDraftMemoDigitalProps } from './TableDraftMemoDigital.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableDraftMemoDigital = (props: TableDraftMemoDigitalProps) => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
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
  } = useTableDraftMemoDigital(props);

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
          value={row.documentType.value}
          dropdownList={[{
            label: row.documentType.label,
            value: row.documentType.value,
          }]}
          disabled
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: (props) => [
        {
          iconName: 'delete',
          isDisabled: deleteAttachmentLoading || props.viewOnly || viewOnly,
          onClick: (data) => {
            handleDeleteDraft(data.documentType.value);
          },
        },
      ],
      sx: {
        width: '68px',
      },
      type: 'action',
    },
  ];

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

  return (
    <>
      <SectionTitle title="Digital Memo" isOpen>
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
      </SectionTitle>
      <ModalDef
        id={modal.DIGITAL_MEMO_DRAFT_MODAL}
        component={ModalDraftMemoDigital}
      />
    </>
  );
};

export default TableDraftMemoDigital;
