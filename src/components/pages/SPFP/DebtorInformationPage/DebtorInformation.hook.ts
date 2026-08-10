'use client';

import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { risalahRapat, spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';


const useDebtorInformation = () => {
  const bucket = useSpfpBucketContext();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const currentPathMenu = usePathname().split('/')[3];
  const validationScheme = yup.object({
    remark: yup.string().nullable(),
    submissionType: yup.string().nullable(),
  });

  const methods = useForm({
    defaultValues: {
      remark: '',
      submissionType: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const { data: applicationTypeList } = useGetParameterList('typeSubmission', { label: 'value1', value: 'key' });

  const { data } = useGetBucketById({
    ...bucket,
  });

  const { data: debtorDetailData } = useGetDetailBucketDebtor({
    ...bucket,
  });

  useEffect(() => {
    methods.reset({
      remark: data?.remarks,
      submissionType: data?.typeSubmission,
    });
    if (applicationTypeList && !(data?.typeSubmission)) {
      methods.reset({
        submissionType: applicationTypeList[0]?.value,
      });
    }
  }, [applicationTypeList, data, methods]);

  useEffect(() => {
    if (data && bucket?.bucketProcessId) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view debtor information detail for bucket: ${bucket?.bucketProcessId}`,
      });
    }
  }, [data, bucket, recordActivity]);

  const handleViewRisalah = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: data.bucketParentId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view risalah rapat for parent bucket: ${data.bucketParentId}`,
    });
    const newUrl = replacePath(
      risalahRapat.DEBTOR_INFORMATION_PAGE, { module: 'draft-list', processId: data.bucketParentId }
    );
    router.push(newUrl);
  };

  const handleViewSpfpCreation = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: data.bucketParentId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view SPFP creation for parent bucket: ${data.bucketParentId}`,
    });
    const newUrl = replacePath(
      spfp.DEBTOR_INFORMATION_PAGE, { module: currentPathMenu, processId: data.bucketParentId }
    );
    router.push(newUrl);
  };

  const handleViewSpdp = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: data.bucketParentId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view SPDP for parent bucket: ${data.bucketParentId}`,
    });
    const newUrl = replacePath(
      spfp.DEBTOR_INFORMATION_PAGE, { module: currentPathMenu, processId: data.bucketParentId }
    );
    router.push(newUrl);
  };

  return {
    applicationTypeList,
    handleViewRisalah,
    handleViewSpdp,
    handleViewSpfpCreation,
    isGroup: debtorDetailData?.isGroup,
    methods,
  };
};

export default useDebtorInformation;
