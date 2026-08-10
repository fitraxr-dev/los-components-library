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
import useGetParameterSLASummary from '../../hooks/useGetParameterSLASummary';

import { TABLE_HEADER } from './TabSummary.constant';

import type { ButtonProps } from '@/components/shared/Button/types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const DRAFT_STATUSES = new Set(['DRAFT', 'RETURN_TO_MAKER'] as const);

const collectDraftBucketProcessIds = (contents?: any[] | null): string[] => {
  if (!Array.isArray(contents)) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const { previous, lastModified } of contents) {
    for (const node of [previous, lastModified] as const) {
      if (!node) continue;

      const id = node.bucketProcessId ?? undefined;
      const status = node.statusProcess ?? undefined;

      if (id && status && DRAFT_STATUSES.has(status) && !seen.has(id)) {
        seen.add(id);
        result.push(String(id));
      }
    }
  }

  return result;
};

type SubmitAction = 'CANCELED' | 'APPROVED' | 'RETURN_TO_MAKER' | 'REJECTED' | 'SUBMIT'

const ACTION_META: Record<SubmitAction, { color: ButtonProps['color']; text: string }> = {
  APPROVED: { color: 'success', text: 'Approve' },
  CANCELED: { color: 'error', text: 'Cancel' },
  REJECTED: { color: 'error', text: 'Reject' },
  RETURN_TO_MAKER: { color: 'primary', text: 'Return to Maker' },
  SUBMIT: { color: 'success', text: 'Submit' },
};

const useTabSummary = () => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const {
    processId,
    isBucketProcessId,
    isSubmission,
    isViewOnly,
  } = useMasterParameter();

  const { data: parameterSLASummaryData, isFetching: isLoading } = useGetParameterSLASummary(
    isBucketProcessId
      ? { bucketProcessId: processId }
      : { module: processId }
  );

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER
  ];

  const { mutate: submitBucket, mutateAsync: submitBucketAsync, isPending: isSubmitLoading } = useSubmitBucket({
    onError: (error) => {
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
            router.push(MASTER_PARAMETER.PARAMETER_SLA_LIST_PAGE);
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
        if (isSubmission) {
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.PARAMETER_SLA,
              process: TypeProcess.PARAMETER_SLA,
            },
          }, {
            onSuccess: () => {
              const statusBefore = parameterSLASummaryData.contents[0]?.previous.statusProcess ?? '';
              const statusAfter = parameterSLASummaryData.contents[0]?.lastModified.statusProcess ?? '';

              recordActivity({
                activity: ActivityType.SUBMIT,
                bucketProcessId: isBucketProcessId ? processId : '',
                changeAfter: statusAfter,
                changeBefore: statusBefore,
                menuCode: 'parameter-sla',
                module: TypeModule.PARAMETER_SLA,
                process: TypeProcess.PARAMETER_SLA,
                remarks: `Update Parameter SLA Proces Status to: ${statusAfter}`,
              });
            },
          });
        } else {
          const contents = parameterSLASummaryData?.contents;

          const draftIds = Array.from(collectDraftBucketProcessIds(contents));
          const singleId = isBucketProcessId && typeof processId === 'string' ? processId : null;

          const ids =
            draftIds.length > 0
              ? draftIds
              : singleId && contents.some(({ previous, lastModified }) =>
                [previous, lastModified].some(
                  (n) => n?.bucketProcessId === singleId && DRAFT_STATUSES.has(n.statusProcess ?? '')
                ))
                ? [singleId]
                : [];

          if (ids.length === 0) {
            await closeNiceModal(MODAL.GLOBAL.COMMENT);
            showNiceModalV2({
              title: 'Tidak ada data berstatus DRAFT/RETURN_TO_MAKER untuk disubmit.',
              type: 'error',
            });
            return;
          }

          await Promise.allSettled(
            ids.map((id) =>
              submitBucketAsync({
                submitRequestDto: {
                  action,
                  bucketProcessId: id,
                  comment,
                  module: TypeModule.PARAMETER_SLA,
                  process: TypeProcess.PARAMETER_SLA,
                },
              }, {
                onSuccess: () => {
                  parameterSLASummaryData?.contents.map((item) => {
                    const statusBefore = item?.previous.statusProcess ?? '';
                    const statusAfter = item?.lastModified.statusProcess ?? '';

                    recordActivity({
                      activity: ActivityType.SUBMIT,
                      bucketProcessId: isBucketProcessId ? processId : '',
                      changeAfter: statusAfter,
                      changeBefore: statusBefore,
                      menuCode: 'parameter-sla',
                      module: TypeModule.PARAMETER_SLA,
                      process: TypeProcess.PARAMETER_SLA,
                      remarks: `Update Parameter SLA Proces Status to: ${statusAfter}`,
                    });
                  });
                },
              })
            )
          );
        }
      },
      submitButtonColor: meta.color,
      submitText: meta.text,
    });
  };

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.PARAMETER_SLA,
    process: TypeProcess.PARAMETER_SLA,
  }, {
    enabled: isBucketProcessId,
  });

  const renderButtons = React.useCallback(() => {
    const rawContents = parameterSLASummaryData?.contents;
    const contents = Array.isArray(rawContents) ? rawContents : [];

    const hasData = contents.length > 0;
    const statusProcess = contents[1]?.statusProcess;

    if (!isBucketProcessId && !isViewOnly) {
      return (
        <>
          <Button
            variant="outlined"
            onClick={() => router.push(MASTER_PARAMETER.PARAMETER_SLA_LIST_PAGE)}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleSubmit('CANCELED')}
            disabled={!hasData}
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => handleSubmit('SUBMIT')}
            disabled={!hasData}
          >
            Submit
          </Button>
        </>
      );
    }

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
        {isSubmission && statusProcess !== 'DRAFT' ? (
          <Button
            variant="outlined"
            onClick={() => router.push(MASTER_PARAMETER.PARAMETER_SLA_LIST_PAGE)}
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
  }, [parameterSLASummaryData, stepperData]);

  const tableData = React.useMemo(() => {
    const contents = parameterSLASummaryData?.contents ?? [];

    return contents.flatMap((item, index) => {
      const entries = [
        item.previous ? { data: item.previous, kind: 'prev' } : null,
        item.lastModified ? { data: item.lastModified, kind: 'modified' } : null,
      ].filter((e) => Boolean(e));

      const rowSpan = entries.length;
      if (rowSpan === 0) return [];

      return entries.map((e, i) => ({
        ...e.data,
        action: { rowSpan: i === 0 ? rowSpan : 0 },
        id: `${e.kind}-${index}`,
        index: { rowSpan: i === 0 ? rowSpan : 0, value: index + 1 },
      }));
    });
  }, [parameterSLASummaryData?.contents]);

  return {
    isLoading,
    renderButtons,
    tableData,
    tableHeader,
  };
};

export default useTabSummary;
