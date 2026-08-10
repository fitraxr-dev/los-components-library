import React, { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname, useSearchParams } from 'next/navigation';

import { MODAL as GLOBAL_MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import useParameterSyariahMode from '../../../hooks/useParameterSyariahMode';
import useGetParameterSyariahSummary from '../../hooks/useGetParameterSyariahSummary';

import { TABLE_HEADER_GROUP } from './TabSummary.constant';
import { MODAL } from './TabSummary.constants';

import type { ButtonProps } from '@/components/shared/Button/types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


type SubmitAction = 'CANCELED' | 'APPROVED' | 'RETURN_TO_MAKER' | 'REJECTED' | 'SUBMIT' | 'COMPLETED'

const ACTION_META: Record<SubmitAction, { color: ButtonProps['color']; text: string }> = {
  APPROVED: { color: 'success', text: 'Approve' },
  CANCELED: { color: 'primary', text: 'Save' },
  COMPLETED: { color: 'success', text: 'Approve' },
  REJECTED: { color: 'error', text: 'Reject' },
  RETURN_TO_MAKER: { color: 'primary', text: 'Return to Maker' },
  SUBMIT: { color: 'success', text: 'Submit' },
};

function collectBucketProcessIds(root: unknown): string[] {
  const out: string[] = [];
  const stack = [root];

  while (stack.length) {
    const cur = stack.pop();
    if (!cur) continue;

    if (Array.isArray(cur)) {
      for (const item of cur) stack.push(item);
    } else if (typeof cur === 'object') {
      const obj = cur as Record<string, unknown>;
      if (typeof obj.bucketProcessId === 'string' && obj.bucketProcessId.trim()) {
        out.push(obj.bucketProcessId);
      }
      for (const v of Object.values(obj)) {
        if (v && (typeof v === 'object' || Array.isArray(v))) stack.push(v);
      }
    }
  }

  return Array.from(new Set(out));
}

function transformSyariahData(data: any[]): any[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const transformedData: any[] = [];
  let indexCounter = 1;

  // Separate items by status
  const previousItems = data.filter((item) => item.status === 'Previous');
  const lastModifiedItems = data.filter((item) => item.status === 'Last Modified');

  // Determine how many pairs we have
  const pairCount = Math.min(previousItems.length, lastModifiedItems.length);
  const processed = new Set<number>();

  // Process paired items (Previous + Last Modified)
  for (let i = 0; i < pairCount; i++) {
    const previous = previousItems[i];
    const lastModified = lastModifiedItems[i];

    // Add Previous row with rowSpan
    transformedData.push({
      ...previous,
      action: { rowSpan: 2, value: indexCounter },
      groupId: `group-${indexCounter}`, // Add groupId for easier pairing in handler
      index: { rowSpan: 2, value: indexCounter },
      status: 'Previous',
      statusLabel: 'Previous',
    });

    // Add Last Modified row with rowSpan 0
    transformedData.push({
      ...lastModified,
      action: { rowSpan: 0, value: '' },
      groupId: `group-${indexCounter}`, // Same groupId for pairing
      index: { rowSpan: 0, value: '' },
      status: 'Last Modified',
      statusLabel: 'Last Modified',
    });

    processed.add(data.indexOf(previous));
    processed.add(data.indexOf(lastModified));
    indexCounter++;
  }

  // Process remaining unpaired items (if any)
  data.forEach((item, idx) => {
    if (processed.has(idx)) return;

    transformedData.push({
      ...item,
      index: indexCounter,
      status: item.status,
      statusLabel: item.status,
    });

    indexCounter++;
  });

  return transformedData;
}

const useTabSummary = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { recordActivity } = useRecordLog();
  const { processId, isBucketProcessId, isViewOnly, isSubmission,
    isSubmissionBucket, isMaker, isChecker } = useParameterSyariahMode();

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summaryParams = {
    bucketProcessId: typeof processId === 'string' ? processId : undefined,
  };

  // Always fetch summary data for display
  const { data: summaryData, isLoading } = useGetParameterSyariahSummary(
    summaryParams,
    {
      enabled: !!processId && typeof processId === 'string',
    }
  );

  const rawContents = Array.isArray(summaryData?.contents) ? summaryData.contents : [];
  const hasPrevious = rawContents.some((item: any) => item.status === 'Previous');
  const hasLastModified = rawContents.some((item: any) => item.status === 'Last Modified');
  const action: 'ADD' | 'UPDATE' = (hasLastModified && !hasPrevious) ? 'ADD' : 'UPDATE';

  // Record activity when summary data is loaded
  useEffect(() => {
    if (summaryData && summaryData.contents) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: 'view parameter syariah summary data',
      });
    }
  }, [summaryData, processId, action, hasPrevious, hasLastModified, rawContents.length, recordActivity]);

  // Transform data for display
  const transformedTableData = transformSyariahData(rawContents);

  // Check if we have both Previous and Last Modified in the data
  const hasBothStatuses = hasPrevious && hasLastModified;

  // Handler for detail click - show both Previous and Last Modified data if available
  const handleDetailClick = (data: any) => {
    // Use groupId to find the pair in transformed data
    const groupId = data.groupId;

    if (groupId) {
      // Find both items with the same groupId in transformed data
      const groupItems = transformedTableData.filter((item: any) => item.groupId === groupId);
      const previousData = groupItems.find((item: any) => item.status === 'Previous');
      const lastModifiedData = groupItems.find((item: any) => item.status === 'Last Modified');

      // Pass both data directly to modal
      NiceModal.show(MODAL.PARAMETER_SYARIAH_DETAIL, {
        lastModifiedData,
        previousData,
      });
    } else {
      // For unpaired items (no groupId), just show the single item
      const isPrevious = data.status === 'Previous';
      NiceModal.show(MODAL.PARAMETER_SYARIAH_DETAIL, {
        lastModifiedData: isPrevious ? null : data,
        previousData: isPrevious ? data : null,
      });
    }
  };

  const baseHeaders: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
  ];

  const statusHeader: TableHeader = {
    key: 'status',
    label: 'Status',
    sx: {
      minWidth: '10vw',
    },
  };

  const dataHeaders: TableHeader[] = [
    {
      key: 'product',
      label: 'Nama Produk',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'productReference',
      label: 'Referensi',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row) => (
        <TextStyle>
          {row.isActive ? 'Ya' : 'Tidak'}
        </TextStyle>
      ),
      sx: {
        minWidth: '6vw',
      },
    },
    {
      key: action === 'ADD' ? 'createdBy' : 'modifiedBy',
      label: action === 'ADD' ? 'Created By' : 'Modified By',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: action === 'ADD' ? 'createdDate' : 'modifiedDate',
      label: action === 'ADD' ? 'Created Date' : 'Modified Date',
      sx: {
        minWidth: '12vw',
      },
      type: 'date',
    },
  ];

  const actionHeader: TableHeader = {
    key: 'action',
    label: 'Action',
    options: (data) => [
      {
        iconName: 'detail',
        onClick: () => handleDetailClick(data),
      },
    ],
    sx: {
      minWidth: '10vw',
    },
    type: 'action',
  };

  // Conditionally build table header
  const tableHeader: TableHeader[] = hasBothStatuses
    ? [...baseHeaders, statusHeader, ...dataHeaders, actionHeader]
    : [...baseHeaders, ...dataHeaders, actionHeader];

  const { mutate: submitBucket, mutateAsync: submitBucketAsync, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'submitted' }),
        changeBefore: summaryData ? JSON.stringify(summaryData.contents) : '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: 'successfully submitted parameter syariah',
      });

      closeNiceModal(GLOBAL_MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(GLOBAL_MODAL.GLOBAL.SUCCESS).then(() => {
            router.push(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_LIST_PAGE);
          });
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const handleSubmit = (submitAction: SubmitAction) => {
    const meta = ACTION_META[submitAction];

    NiceModal.show(GLOBAL_MODAL.GLOBAL.COMMENT, {
      isLoading: isSubmitLoading,
      onSave: async ({ comment }: { comment: string }) => {
        // Record the submit action initiation
        recordActivity({
          activity: submitAction === 'SUBMIT' ? ActivityType.SUBMIT :
            submitAction === 'APPROVED' || submitAction === 'COMPLETED' ? ActivityType.APPROVE :
              submitAction === 'REJECTED' ? ActivityType.REJECT :
                submitAction === 'RETURN_TO_MAKER' ? ActivityType.RETURN_TO_MAKER :
                  submitAction === 'CANCELED' ? ActivityType.CANCEL : ActivityType.SUBMIT,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({ action: submitAction, comment }),
          changeBefore: summaryData ? JSON.stringify(summaryData.contents) : '',
          menuCode: 'parameter-skema-syariah',
          module: TypeModule.PARAMETER_SYARIAH,
          process: TypeProcess.PARAMETER_SYARIAH,
          remarks: `initiated ${submitAction.toLowerCase().replace(/_/g, ' ')} action`,
        });

        if (isSubmission) {
          submitBucket({
            submitRequestDto: {
              action: submitAction,
              bucketProcessId: processId,
              comment,
              module: 'PARAMETER_SYARIAH',
              process: 'PARAMETER_SYARIAH',
            },
          });
        } else {
          const idsFromSummary = collectBucketProcessIds(summaryData?.contents);
          const ids = idsFromSummary.length > 0
            ? idsFromSummary
            : (isBucketProcessId && typeof processId === 'string' ? [processId] : []);

          if (ids.length === 0) {
            showNiceModalV2({
              title: 'Tidak ada data yang memiliki bucketProcessId',
              type: 'warning',
            });
            return;
          }

          const results = await Promise.allSettled(
            ids.map((id) =>
              submitBucketAsync({
                submitRequestDto: {
                  action: submitAction,
                  bucketProcessId: id,
                  comment,
                  module: 'PARAMETER_SYARIAH',
                  process: 'PARAMETER_SYARIAH',
                },
              })
            )
          );

          const failures: Array<{ id: string; reason: unknown }> = [];
          results.forEach((res, idx) => {
            const id = ids[idx];
            if (res.status === 'rejected') failures.push({ id, reason: res.reason });
          });

          await closeNiceModal(GLOBAL_MODAL.GLOBAL.COMMENT);

          if (failures.length === 0) {
            showNiceModalV2({
              onClose: () => {
                closeNiceModal(GLOBAL_MODAL.GLOBAL.SUCCESS).then(() => {
                  router.push(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_LIST_PAGE);
                });
              },
              title: 'Data berhasil disimpan.',
              type: 'success',
            });
          } else {
            showNiceModalV2({
              title: 'Data gagal disimpan.',
              type: 'error',
            });
          }
        }
      },
      submitButtonColor: meta.color,
      submitText: meta.text,
    });
  };

  const renderButtons = () => {
    if (isViewOnly) return null;

    const hasData = rawContents.length > 0;

    // Find the item with status "Last Modified" to get the actual statusBucket
    const lastModifiedItem = rawContents.find((item: any) => item.status === 'Last Modified');
    const statusBucket = lastModifiedItem?.statusBucket;

    const FINAL_STATUSES = new Set(['APPROVED', 'REJECTED', 'CANCELED']);
    const isStatusFinal = statusBucket ? FINAL_STATUSES.has(statusBucket) : false;

    if (isSubmission && isStatusFinal) return null;

    // Show submission buttons if checker and statusBucket is WAITING_APPROVAL_CHECKER
    const showSubmissionButtons = isChecker && statusBucket === 'WAITING_APPROVAL_CHECKER';

    // Show edit buttons if maker and statusBucket is DRAFT or RETURN_TO_MAKER
    const showEditButtons = isMaker && (statusBucket === 'DRAFT' || statusBucket === 'RETURN_TO_MAKER');

    // If submission mode but no buttons to show, return null
    if (isSubmission && !showSubmissionButtons && !showEditButtons) return null;

    const submissionButtons = [
      { label: 'Close', onClick: () => router.push(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_LIST_PAGE), variant: 'outlined' as const },
      { label: 'Return to Maker', onClick: () => handleSubmit('RETURN_TO_MAKER') },
      { color: 'error', label: 'Reject', onClick: () => handleSubmit('REJECTED'), variant: 'outlined' },
      { color: 'success', label: 'Approve', onClick: () => handleSubmit('COMPLETED') },
    ];

    const editButtons = [
      { color: 'error', disabled: !hasData, label: 'Cancel', onClick: () => handleSubmit('CANCELED'), variant: 'outlined' },
      { color: 'success', disabled: !hasData, label: 'Submit', onClick: () => handleSubmit('SUBMIT') },
    ];

    // Determine which buttons to show
    let buttons;
    if (showSubmissionButtons) {
      buttons = submissionButtons;
    } else if (showEditButtons || !isSubmission) {
      buttons = editButtons;
    } else {
      return null;
    }

    return (
      buttons.map(({ label, ...props }) => (
        <Button key={label} {...props}>
          {label}
        </Button>
      ))
    );
  };

  // Extract page info if available
  const pageInfo = summaryData && 'page' in summaryData ? (summaryData as any).page : null;

  // Title based on action
  // const pageTitle = action === 'ADD' ? 'Add New Syariah' : 'Update Syariah';
  const pageTitle = 'Update Syariah';

  return {
    isLoading,
    itemData: transformedTableData,
    page,
    pageSize,
    pageTitle,
    renderButtons,
    setPage,
    setPageSize,
    tableData: transformedTableData,
    tableHeader,
    tablePage: pageInfo,
    updateItemData: transformedTableData,
  };
};

export default useTabSummary;
