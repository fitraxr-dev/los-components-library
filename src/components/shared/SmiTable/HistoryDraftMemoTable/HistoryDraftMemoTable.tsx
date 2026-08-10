import React from 'react';

import { roles } from '@/configs/constants';
import { downloadFile } from '@/helpers/utils';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter/TableFooter';

import { GENERATE, TABLE_HEADER_DRAFT_MEMO } from './HistoryDraftMemoTable.constants';
import { useHistoryDraftMemoTable } from './HistoryDraftMemoTable.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const HistoryDraftMemoTable = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const {
    handleOpenAddModal,
    handleDeleteDraft,
    setNoPage,
    setItemPerPage,
    draftMemoList,
    draftMemoPage,
    deleteLoading,
    draftMemoLoading,
    noPage,
  } = useHistoryDraftMemoTable();

  const tableHeaderDraftMemo: Array<TableHeader> = [
    ...TABLE_HEADER_DRAFT_MEMO,
    {
      key: 'action',
      label: 'Action',
      options: (props) => props.type === GENERATE && props.viewOnly ? [
        { iconName: 'preview-document',
          isDisabled: deleteLoading,
          isUseOnclick: true,
          onClick: (data) =>
            window.open((`${data?.fileUrl}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: deleteLoading,
          isUseOnclick: true,
          onClick: (data) => downloadFile(data.fileUrl, data.fileName),
        }
      ] : [
        {
          iconName: 'delete',
          isDisabled: deleteLoading || props.viewOnly || viewOnly,
          onClick: (data) => handleDeleteDraft(data.id),
        },
        { iconName: 'preview-document',
          isDisabled: deleteLoading,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: deleteLoading,
          onClick: (data) => downloadFile(data.fileUrl, data.fileName),
        },
      ],
      type: 'action',
    },
  ];

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <SectionTitle title="History Draft Memo" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderDraftMemo}
          tableData={draftMemoList}
          isLoading={draftMemoLoading}
          currentPage={noPage}
          totalPage={draftMemoPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={!isViewOnly && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
        />
      </BaseContainer>
    </BaseContainer>
  );
};

export default HistoryDraftMemoTable;
