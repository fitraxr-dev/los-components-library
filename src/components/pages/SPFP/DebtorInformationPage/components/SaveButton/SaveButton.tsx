'use client';
import { useFormContext } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


const SaveButton = () => {
  const { goToNextStep } = useSpfpContext();
  const bucket = useSpfpBucketContext();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const methods = useFormContext();

  const { data: dataBucket } = useGetBucketById({
    ...bucket,
  });

  const { mutate: mutateSave, isPending } = useSaveBucketDetail({
    onError: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to save debtor information for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `successfully saved debtor information for bucket: ${bucket?.bucketProcessId}`,
      });
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `navigate to next step after saving debtor information for bucket: ${bucket?.bucketProcessId}`,
      });
      goToNextStep();
    },
  });

  function handleSaveAndNext(data) {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `click next button on debtor information page for bucket: ${bucket?.bucketProcessId}`,
    });
    goToNextStep();

    // mutateSave({
    //   ...dataBucket,
    //   remarks: data.remark,
    //   typeFinancing: dataBucket.financeType,
    //   typeSubmission: data.submissionType,
    //   ...bucket,
    // });
  }

  return (
    <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
      <Button
        isLoading={isPending}
        onClick={methods.handleSubmit(handleSaveAndNext)}
      >
        {viewOnly ? 'Next' : 'Next'}
      </Button>
    </RowWrapper>

  );
};


export default SaveButton;
