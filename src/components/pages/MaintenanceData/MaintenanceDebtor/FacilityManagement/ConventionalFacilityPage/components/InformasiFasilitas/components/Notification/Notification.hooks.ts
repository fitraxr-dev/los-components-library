import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess, TypeModule } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetNotificationDetail from '../../../../hooks/Notification/useGetNotification';
import useSaveNotification from '../../../../hooks/Notification/useSaveNotification';
import useGetChangesDetail from '../../../../hooks/useGetChangesDetail';

import { notificationSchema } from './Notification.constant';


export const useNotification = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const isEdit = params.get('isEdit');
  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;

  const { data: intervalOptions } = useGetParameterList('intervalNotif', { label: 'value1', value: 'key' });

  const { control, watch, reset, getValues, formState: { isValid } } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(notificationSchema),
  });

  const { data: statusProjectPhaseOptions } = useGetParameterList('statusProjectPhase', { label: 'value1', value: 'key' });

  const { data: notificationInformation } = useGetNotificationDetail({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab notification',
    });
  }, []);

  useEffect(() => {
    if (notificationInformation) {
      reset(notificationInformation?.data?.content as any);
    }
  }, [notificationInformation]);

  const { mutate: saveNotification } = useSaveNotification({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(notificationInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer conventional notification page',
      });
      showNiceModalV2({
        title: error?.message,
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(notificationInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer conventional notification page',
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSaveNotification = () => {
    if (!isValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveNotification({
            ...getValues(),
            bucketProcessId: processId as string,
            facilityId: id as string,
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveNotification({
        ...getValues(),
        bucketProcessId: processId as string,
        facilityId: id as string,
      });
    }

  };


  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId as string,
    // debtorId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId && orderType === 'proposal') enabled = true;

    return enabled;
  }, [bucketDetail, orderType]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetChangesDetail({
    // ...payloadFilterList(processId as string),
    bucketProcessId: processId as string,
    component: 'notification',
    debtorId: bucketDetail?.debtorId,
    facilityId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; id: string}[]) => {
    let previousValue = null;
    if (dataDelta?.data?.content?.differencesData?.some((el) => el?.field === inputKey)) {
      const findPrevValues = dataDelta?.data?.content &&
        dataDelta?.data?.content?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          const foundItem = dropdownInputList?.find((item) => String(item?.value) === String(findPrevValues));
          previousValue = foundItem?.label ?? findPrevValues;
        } else {
          if (inputKey.toLowerCase().includes('date')) {
            previousValue = formatDate(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };

  return {
    control,
    findDataMaster,
    handleSaveNotification,
    intervalOptions,
    isViewOnly,
    statusProjectPhaseOptions,
    theme,
    watch,
  };
};
