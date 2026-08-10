import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { downloadFile } from '@/helpers/utils';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import ModalUploadDocumentExisting from '@/components/shared/SmiModal/ModalUploadDocumentExisting';
import { modal, TABLE_HEADER } from '@/components/shared/SmiTable/ViewAllDocument/constants';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { useTableMemoSupplementDocument } from './TableMemoSupplementDocument.hook';

import type { TableMemoSupplementDocumentProps } from './TableMemoSupplementDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableMemoSupplementDocument = (props: TableMemoSupplementDocumentProps) => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();

  const {
    memoSupplementLoading,
    memoSupplementList,
    memoSupplementPage,
    isDeleteLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    handleAddDocument,
    handleOpenEditModal,
    handleOpenDeleteModal,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
  } = useTableMemoSupplementDocument(props);

  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);
  const isDisabled = isDeleteLoading || isSuperAdmin || viewOnly;

  const allowUpload = React.useMemo(() => {
    const isFromHR = state.stepper.from === 'HR_ASK_FOR_INFO';
    const isApuPptModule = props.module === TypeModule.APU_PPT;

    const normal = !viewOnly;
    const hrException = isApuPptModule && isFromHR;

    return normal || hrException;
  }, [state.stepper.from, props.module, viewOnly]);

  const tableHeaderMemo: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'createdBy',
      label: 'Uploaded By',
      sx: { minWidth: '10vw' },
    },
    ...(
      props.process === TypeProcess.MIP_REVIEW
        ? [
          {
            key: 'divisionLabel',
            label: 'Divisi',
            sx: { minWidth: '8vw' },
          }
        ] : []
    ),
    {
      key: 'createdDate',
      label: 'Uploaded Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: (row) => row.ownership === 'MIP_REVIEW' ? [
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
      ] : [
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
      ],
      sx: {
        width: '12%',
      },
      type: 'action',
    },
  ];

  return (
    <>
      <SectionTitle title="Upload Document" isOpen>
        {
          !(props.process === TypeProcess.MIP_REVIEW) &&
          <Search
            value={filter}
            isDebounced
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        }
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderMemo}
            tableData={memoSupplementList}
            isLoading={memoSupplementLoading}
            currentPage={noPage}
            totalPage={memoSupplementPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={allowUpload ? <TableFooter onClick={handleAddDocument} /> : null}
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
    </>
  );
};

export default TableMemoSupplementDocument;
