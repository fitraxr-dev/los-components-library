import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import useDebtorDetail from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useDebtorDetail';

import useGetGroupMemberDetail from '../../../hooks/useGetGroupMemberDetail';
import useUpdateGroupMemberDetail from '../../../hooks/useUpdateGroupMemberDetail';


const useMemberInformationDetail = () => {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('isEdit') === 'true';
  // const bucketProcessId = searchParams.get('bucketProcessId');
  const { memberId, groupId } = useParams();
  const { data: debtorDetail } = useDebtorDetail({ debtorId: memberId as string });
  const { recordActivity } = useRecordLog();
  const { data: groupMemberDetail } = useGetGroupMemberDetail(
    {
      debtorCode: memberId as string,
      groupId: groupId as string,
      // bucketProcessId: bucketProcessId as string,
    });

  const [state] = useApp();
  const isRM = state.currentRole.includes(roles.RM);

  const { control, reset } = useForm(
    {
      context: 'detailMember',
      mode: 'onChange',
    }
  );

  const debtorDetailData = debtorDetail?.data?.content;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer group information detail - member information detail page',
    });
  }, []);

  useEffect(() => {
    console.log('groupMemberDetail', groupMemberDetail);

    if (debtorDetailData) {
      const body = {
        ...debtorDetailData,
        ...groupMemberDetail?.data?.content,
      };
      // setValue('detailMember', body);
      reset(body);
    }

    console.log('control', control);
  }, [debtorDetail]);

  const { mutate, isPending } = useUpdateGroupMemberDetail({
    onError: () => {
      showNiceModalV2({
        title: 'Data tidak valid',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = (data: any) => {
    // const data = getValues('detailMember');
    // const data = getValues();
    console.log('data', data);
    mutate({
      // bucketProcessId: bucketProcessId,
      debtorCode: memberId as string,
      groupId: groupId as string,
      hasFinancialDependency: !!data.hasFinancialDependency,
      hasSharedDirectors: !!data.hasSharedDirectors,
      isControlledBySameParty: !!data.isControlledBySameParty,
      isControllingOther: !!data.isControllingOther,
      isGuarantorForOther: !!data.isGuarantorForOther,
      remark: data.remark, //
    });

  };

  return {
    control,
    handleSave,
    isEdit,
    isRM,
    reset,
  };
};

export default useMemberInformationDetail;
