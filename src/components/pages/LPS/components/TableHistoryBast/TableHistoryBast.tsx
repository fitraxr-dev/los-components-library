import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/components/ModalDraftMemoHistory';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter/TableFooter';
import Title from '@/components/shared/Title';

import { GENERATE, modal, TABLE_HEADER_DRAFT_MEMO } from './TableHistoryBast.constants';
import { useTableHistoryBast } from './TableHistoryBast.hook';

import type { TableHistoryBastProps } from './TableHistoryBast.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableHistoryBast = (props: TableHistoryBastProps) => {
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
    retryLoading,
    handleRetryGenerate,
    draftMemoLoading,
    noPage,
    handleDownloadMemo,
  } = useTableHistoryBast(props);
  const tableHeaderDraftMemo: Array<TableHeader> = [
    ...TABLE_HEADER_DRAFT_MEMO,
    {
      key: 'action',
      label: 'Action',
      options: (props) => {
        const baseActions = props.type === GENERATE || props.viewOnly ? [
          {
            iconName: 'preview-document',
            isDisabled: deleteLoading || !props.isGenerated,
            isLoading: deleteLoading || !props.isGenerated,
            onClick: (data) =>
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: deleteLoading || !props.isGenerated,
            isLoading: deleteLoading || !props.isGenerated,
            onClick: (data) => handleDownloadMemo(data),
          }
        ] : [
          {
            iconName: 'delete',
            isDisabled: deleteLoading || props.viewOnly || viewOnly,
            isLoading: deleteLoading || !props.isGenerated,
            onClick: (data) => handleDeleteDraft(data.id, data?.documentName),
          },
          {
            iconName: 'preview-document',
            isDisabled: deleteLoading || !props.isGenerated,
            isLoading: deleteLoading || !props.isGenerated,
            onClick: (data) =>
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: deleteLoading || !props.isGenerated,
            isLoading: deleteLoading || !props.isGenerated,
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
        <Title title="History BAST" />
        {renderButtons()}
      </RowWrapper>
      <SectionTitle title="History BAST" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderDraftMemo}
          tableData={draftMemoList}
          isLoading={draftMemoLoading}
          currentPage={noPage}
          totalPage={draftMemoPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={!props.hideBtnAdd && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
        />
      </BaseContainer>

      <ModalDef
        id={modal.HISTORY_DRAFT_MEMO}
        component={ModalDraftMemoHistory}
      />
    </BaseContainer >

  );
};

export default TableHistoryBast;
