import NiceModal, { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter/TableFooter';
import Title from '@/components/shared/Title';

import ModalDraftMemoHistory from './components/ModalDraftMemoHistory';
import { GENERATE, modal, TABLE_HEADER_DRAFT_MEMO } from './TableDraftMemoHistory.constants';
import { useTableDraftMemoHistory } from './TableDraftMemoHistory.hook';

import type { DraftMemoHistoryProps } from './TableDraftMemoHistory.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableDraftMemoHistory = (props: DraftMemoHistoryProps) => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const {
    handleOpenAddModal,
    handleDeleteDraft,
    downloadLoading,
    setNoPage,
    setItemPerPage,
    draftMemoList,
    draftMemoPage,
    deleteLoading,
    draftMemoLoading,
    noPage,
    handleDownloadMemo,
    handleRetryGenerate,
    retryLoading,
  } = useTableDraftMemoHistory(props);

  const tableHeaderDraftMemo: Array<TableHeader> = [
    ...TABLE_HEADER_DRAFT_MEMO,
    {
      key: 'action',
      label: 'Action',
      options: (props) => {
        const baseActions = props.type === GENERATE || props.viewOnly ? [
          {
            iconName: 'preview-document',
            isDisabled: !props.isGenerated,
            isLoading: !props.isGenerated,
            onClick: (data) => {
              if (data?.fileUrl) {
                window.open((`${data?.fileUrl}?preview=true`), '_blank', 'noopener,noreferrer');
              } else {
                NiceModal.show(MODAL.GLOBAL.WARNING, {
                  title: 'File tidak ditemukan',
                });
              }
            },
          },
          {
            iconName: 'download',
            isDisabled: downloadLoading || !props.isGenerated,
            isLoading: downloadLoading || !props.isGenerated,
            onClick: (data) => handleDownloadMemo(data),
          },
        ] : [
          {
            iconName: 'delete',
            isDisabled: deleteLoading || props.viewOnly || viewOnly,
            onClick: (data) => handleDeleteDraft(data.id, data?.documentName),
          },
          {
            iconName: 'preview-document',
            isDisabled: !props.isGenerated,
            isLoading: !props.isGenerated,
            onClick: (data) => {
              if (data?.fileUrl) {
                window.open((`${data?.fileUrl}?preview=true`), '_blank', 'noopener,noreferrer');
              } else {
                NiceModal.show(MODAL.GLOBAL.WARNING, {
                  title: 'File tidak ditemukan',
                });
              }
            },
          },
          {
            iconName: 'download',
            isDisabled: downloadLoading || !props.isGenerated,
            isLoading: downloadLoading || !props.isGenerated,
            onClick: (data) => handleDownloadMemo(data),
          },
        ];

        if (props.shouldShowRetry) {
          baseActions.push({
            iconName: 'refresh',
            isDisabled: retryLoading,
            isLoading: retryLoading,
            onClick: (data) => handleRetryGenerate(data),
          });
        }

        return baseActions;
      },
      type: 'action',
    },
  ];

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

  const renderButtons = () => (
    <RowWrapper>
      {props.buttons.map((el) => (
        <Button
          key={el.label}
          sx={{ ml: 2, px: 4, py: 1.5 }}
          startIcon={el.iconName}
          variant={el.variant}
          color={el.color ?? 'primary'}
          onClick={el.onClick ?? null}
          {...(el.disabled && { disabled: true })}
        >
          {el.label}
        </Button>
      ))}
    </RowWrapper>
  );

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <RowWrapper sx={{ justifyContent: 'space-between', my: 2 }}>
        <Title title={!!props.title ? props.title : 'History Draft Memo'} />
        {renderButtons()}
      </RowWrapper>
      <SectionTitle title={!!props.title ? props.title : 'History Draft Memo'} isOpen>
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
      </SectionTitle>
      <ModalDef
        id={modal.HISTORY_DRAFT_MEMO}
        component={ModalDraftMemoHistory}
      />
    </BaseContainer >

  );
};

export default TableDraftMemoHistory;
