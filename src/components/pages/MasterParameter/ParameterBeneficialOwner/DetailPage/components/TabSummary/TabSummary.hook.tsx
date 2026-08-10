import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import Button from '@/components/shared/Button';

import { TAB } from '../../Detail.constant';
import useGetParameterGroupSummary from '../../hooks/useGetParameterGroupSummary';

import {
  INDEX_COL,
  STATUS_COL,
  SUMMARY_MODAL_IDS,
  TABLE_HEADER_GROUP,
  TABLE_HEADER_ITEM,
  TABLE_HEADER_SUBITEM,
} from './TabSummary.constant';

import type { ButtonProps } from '@/components/shared/Button/types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


type SubmitAction = 'CANCELED' | 'APPROVED' | 'RETURN_TO_MAKER' | 'REJECTED' | 'SUBMIT'

const ACTION_META: Record<SubmitAction, { color: ButtonProps['color']; text: string }> = {
  APPROVED: { color: 'success', text: 'Approve' },
  CANCELED: { color: 'error', text: 'Cancel' },
  REJECTED: { color: 'error', text: 'Reject' },
  RETURN_TO_MAKER: { color: 'primary', text: 'Return to Maker' },
  SUBMIT: { color: 'success', text: 'Submit' },
};

function generateTableHeader(
  base: TableHeader[],
  opts?: { includeStatus?: boolean }
): TableHeader[] {
  const { includeStatus = false } = opts ?? {};
  return includeStatus ? [INDEX_COL, STATUS_COL, ...base] : [INDEX_COL, ...base];
}

const useTabSummary = () => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const {
    processId,
    isBucketProcessId,
    isSubmission,
  } = useMasterParameter();

  const {
    data: { group, item, subItem } = {
      group: { add: [], update: []},
      item: { add: [], update: []},
      subItem: { add: [], update: []},
    },
    isLoading,
  } = useGetParameterGroupSummary({ bucketProcessId: processId });

  const handleOpenSummaryDetailModal = React.useCallback(
    ({ row, type, mode }: { row: any; type: string; mode: string }) => {
      NiceModal.show(SUMMARY_MODAL_IDS.SUMMARY_DETAIL_MODAL, {
        mode,
        summaryData: row,
        type,
      });
    },
    []
  );

  const actionCol = React.useCallback((type: string, mode: string): TableHeader => ({
    key: 'action',
    label: 'Action',
    options: () => [
      {
        iconName: 'detail',
        onClick: (row: any) => handleOpenSummaryDetailModal({ mode, row, type }),
      },
    ],
    sx: { maxWidth: '10vw' },
    type: 'action',
  }), [handleOpenSummaryDetailModal]);

  const tableHeaderGroupUpdate: TableHeader[] = React.useMemo(() => {
    return [
      ...generateTableHeader(TABLE_HEADER_GROUP, { includeStatus: true }),
      actionCol('group', 'update')
    ];
  }, [actionCol]);
  const tableHeaderGroupAdd: TableHeader[] = React.useMemo(() => {
    return [
      ...generateTableHeader(TABLE_HEADER_GROUP, { includeStatus: false }),
      actionCol('group', 'create'),
    ];
  }, [actionCol]);

  const tableHeaderItemUpdate: TableHeader[] = React.useMemo(
    () => [
      ...generateTableHeader(TABLE_HEADER_ITEM, { includeStatus: true }),
      actionCol('item', 'update'),
    ],
    [actionCol]
  );
  const tableHeaderItemAdd: TableHeader[] = React.useMemo(
    () => [
      ...generateTableHeader(TABLE_HEADER_ITEM, { includeStatus: false }),
      actionCol('item', 'create'),
    ],
    [actionCol]
  );

  const tableHeaderSubItemUpdate: TableHeader[] = React.useMemo(
    () => [
      ...generateTableHeader(TABLE_HEADER_SUBITEM, { includeStatus: true }),
      actionCol('subitem', 'update'),
    ],
    [actionCol]
  );
  const tableHeaderSubItemAdd: TableHeader[] = React.useMemo(
    () => [
      ...generateTableHeader(TABLE_HEADER_SUBITEM, { includeStatus: false }),
      actionCol('subitem', 'create'),
    ],
    [actionCol]
  );

  const tableData = React.useMemo(() => {
    const transformUpdate = (list?: any[]) =>
      Array.isArray(list)
        ? list.flatMap((entry: any, idx: number) => {
          const parts = [
            entry?.previous ? { data: entry.previous, kind: 'prev' } : null,
            entry?.lastModified ? { data: entry.lastModified, kind: 'modified' } : null,
          ].filter(Boolean);

          const span = parts.length;
          if (span === 0) return [];

          return parts.map((p, i) => ({
            ...p.data,
            _kind: p.kind,
            _raw: entry,
            action: i === 0 ? { rowSpan: span } : { rowSpan: 0 },
            index: i === 0 ? { rowSpan: span, value: idx + 1 } : { rowSpan: 0 },
          }));
        })
        : [];

    return {
      group: { add: group?.add ?? [], update: transformUpdate(group?.update) },
      item: { add: item?.add ?? [], update: transformUpdate(item?.update) },
      subItem: { add: subItem?.add ?? [], update: transformUpdate(subItem?.update) },
    };
  }, [group, item, subItem]);

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            router.push(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_LIST_PAGE);
          });
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const handleSubmit = (action: SubmitAction) => {
    const meta = ACTION_META[action];

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isLoading: isSubmitLoading,
      onSave: async ({ comment }: { comment: string }) => {
        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.PARAMETER_BENEFICIAL_OWNER,
            process: TypeProcess.PARAMETER_BENEFICIAL_OWNER,
          },
        }, {
          onSuccess: () => {
            recordActivity({
              activity: ActivityType.SUBMIT,
              bucketProcessId: isBucketProcessId ? processId : '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'parameter-beneficial-owner',
              module: TypeModule.PARAMETER_BENEFICIAL_OWNER,
              process: TypeProcess.PARAMETER_BENEFICIAL_OWNER,
              remarks: 'Update Parameter Group Proces Status',
            });
          },
        });
      },
      submitButtonColor: meta.color,
      submitText: meta.text,
    });
  };

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.PARAMETER_BENEFICIAL_OWNER,
    process: TypeProcess.PARAMETER_BENEFICIAL_OWNER,
  }, { enabled: isBucketProcessId });

  const renderButtons = React.useCallback(() => {
    const groupRows = [...(group?.update ?? []), ...(group?.add ?? [])];
    const itemRows = [...(item?.update ?? []), ...(item?.add ?? [])];
    const subRows = [...(subItem?.update ?? []), ...(subItem?.add ?? [])];

    const hasData = groupRows.length + itemRows.length + subRows.length > 0;

    const summaryStep = stepperData?.steps?.find((step) => step.key === TAB.SUMMARY);
    if (!(summaryStep && summaryStep.action)) return null;
    const actionEntries = Object.entries(summaryStep.action).filter(([key]) => key !== 'CLOSE');

    const STYLE = {
      APPROVE: { color: 'success', label: 'Approve' },
      CANCELED: { color: 'error', disabled: !hasData, label: 'Cancel', variant: 'outlined' },
      COMPLETED: { color: 'success', label: 'Complete' },
      REJECT: { color: 'error', label: 'Reject', variant: 'outlined' },
      RETURN_TO_MAKER: { label: 'Return to Maker' },
      SUBMIT: { color: 'success', disabled: !hasData, label: 'Submit' },
    };

    return (
      <>
        {isSubmission ? (
          <Button
            variant="outlined"
            onClick={() => router.push(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_LIST_PAGE)}
          >
            Close
          </Button>
        ) : null}
        {actionEntries.map(([key, value]) => {
          const button = STYLE[key] ?? { label: 'Action', variant: 'outlined' };

          const handleClick = () => {
            if (typeof value === 'string') {
              handleSubmit(value as SubmitAction);
              return;
            }
            console.warn('Unknown action payload', { key, value });
          };

          return (
            <Button key={key} {...button} onClick={handleClick}>
              {button.label}
            </Button>
          );
        })}
      </>
    );
  }, [group, item, subItem, stepperData, router]);

  return {
    isLoading,
    renderButtons,
    tableData,
    tableHeaders: {
      group: { add: tableHeaderGroupAdd, update: tableHeaderGroupUpdate },
      item: { add: tableHeaderItemAdd, update: tableHeaderItemUpdate },
      subItem: { add: tableHeaderSubItemAdd, update: tableHeaderSubItemUpdate },
    },
  };
};

export default useTabSummary;
