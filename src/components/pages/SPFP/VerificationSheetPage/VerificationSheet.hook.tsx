import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DP_2_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
  roles,
} from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetDetailVerificationSheet from './hooks/useGetDetailVerification';


export const useVerificationSheet = () => {
  const router = useCustomRouter();
  const bucket = useSpfpBucketContext();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const isSpfpFinal = bucket?.process === 'SPFP_FINAL';
  const isMaker = state.currentRole?.includes(roles.MAKER);
  const isChecker = state.currentRole?.includes(roles.CHECKER);
  const isTaskForce = state.currentPosition?.includes('TASK_FORCE');
  const isDti = isTaskForce || isMaker || isChecker;
  const isSPFP = bucket?.process === TypeProcess.SPFP;

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];

  const userDivisionCode = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode;
  const isBusinessDivision = businessDivisionArray.includes(userDivisionCode);


  const {
    data: bucketDetail,
  } = useGetBucketById({ ...bucket });

  const { data: verificationSheetData, isLoading: isFetching } = useGetDetailVerificationSheet({
    ...bucket,
  });

  useEffect(() => {
    if (verificationSheetData && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view verification sheet detail for bucket: ${bucket?.bucketProcessId}`,
      });
    }
  }, [verificationSheetData, isFetching, bucket, recordActivity]);

  // application type form (submissionType, remark)
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

  useEffect(() => {
    if (!bucketDetail) return;

    methods.reset({
      remark: bucketDetail?.remarks ?? '',
      submissionType:
        bucketDetail?.typeSubmission ??
        applicationTypeList?.[0]?.value ??
        '',
    });
  }, [bucketDetail, applicationTypeList]);

  useEffect(() => {
    const tab = searchParams?.get('tab');

    if (tab === 'dpop') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  const handleChangeTab = (val: number) => {
    if (val === 0) {
      router.push(`${pathname}`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=dpop`);
    }
  };

  return {
    activeTab,
    // application type controls
    applicationTypeList,
    bucketDetail,
    handleChangeTab,
    isBusinessDivision,
    isDpop: (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP'),
    isDti,
    isFetching,
    isSPFP,
    isSpfpFinal,
    methods,
    verificationSheetData,
    viewOnly,
  };
};
