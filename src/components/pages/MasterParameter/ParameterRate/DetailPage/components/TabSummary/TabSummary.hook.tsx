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
import useGetParameterRateSummary from '../../hooks/useGetParameterRateSummary';

import { TABLE_HEADER } from './TabSummary.constant';

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

const useTabSummary = () => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const {
    processId,
    isBucketProcessId,
    isSubmission,
  } = useMasterParameter();

  const { data: parameterRateSummaryData, isFetching: isLoading } = useGetParameterRateSummary(
    isBucketProcessId
      ? { bucketProcessId: processId }
      : { id: Number(processId) }
  );

  const tableHeader: TableHeader[] = [...TABLE_HEADER];

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
            router.push(MASTER_PARAMETER.PARAMETER_RATE_LIST_PAGE);
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
            module: TypeModule.PARAMETER_RATE,
            process: TypeProcess.PARAMETER_RATE,
          },
        }, {
          onSuccess: () => {
            const statusBefore = parameterRateSummaryData.contents[0]?.previous.statusBucket ?? '';
            const statusAfter = parameterRateSummaryData.contents[0]?.lastModified.statusBucket ?? '';

            recordActivity({
              activity: ActivityType.SUBMIT,
              bucketProcessId: isBucketProcessId ? processId : '',
              changeAfter: statusAfter,
              changeBefore: statusBefore,
              menuCode: 'parameter-rate',
              module: TypeModule.PARAMETER_RATE,
              process: TypeProcess.PARAMETER_RATE,
              remarks: `Update Parameter Rate Proces Status to: ${statusAfter}`,
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
    module: TypeModule.PARAMETER_RATE,
    process: TypeProcess.PARAMETER_RATE,
  }, { enabled: isBucketProcessId });

  const renderButtons = () => {
    const rawContents = parameterRateSummaryData?.contents;
    const contents = Array.isArray(rawContents) ? rawContents : [];

    const hasData = contents.length > 0;
    const statusBucket = contents[1]?.statusBucket;

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
        {isSubmission && statusBucket !== 'DRAFT' ? (
          <Button
            variant="outlined"
            onClick={() => router.push(MASTER_PARAMETER.PARAMETER_RATE_LIST_PAGE)}
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
  };

  const tableData = React.useMemo(() => {
    const contents = parameterRateSummaryData?.contents ?? [];

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
  }, [parameterRateSummaryData?.contents]);

  return {
    isLoading,
    renderButtons,
    tableData,
    tableHeader,
  };
};

export default useTabSummary;
