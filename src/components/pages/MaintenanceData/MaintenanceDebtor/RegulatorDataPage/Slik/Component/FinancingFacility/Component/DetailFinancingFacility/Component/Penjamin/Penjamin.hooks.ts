import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service/api';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetDeltaDetailSlik from '../../../../../../hooks/useGetDeltaDetailSlik';
import useGetSlikPenjaminDetail from '../../../../hooks/UseGetSlikPenjaminDetail';
import useSaveSlikPenjamin from '../../../../hooks/useSaveSlikPenjamin';

import { penjaminFormSchema } from './Penjamin.constant';


export const usePenjamin = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { id } = useParams();
  const isDebtor = processId?.includes('DEBT');
  const searchParams = useSearchParams();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const canEdit = searchParams.get('isEdit') === 'true';
  const isViewOnly = !roleCanEdit || isDebtor || !canEdit;
  const router = useCustomRouter();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const { recordActivity } = useRecordLog();
  const isKonven = searchParams.get('isKonven') === 'true';

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer slik penjamin ' + (isKonven ? 'konven' : 'syariah') + ' page',
    });
  }, []);

  const { control, reset, watch, setValue, getValues, trigger, formState: { isValid } } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(penjaminFormSchema),
  });


  const { data: gurantorCodeList } = useGetParameterList('identityGurantortype', { label: 'value1', value: 'key' });
  const { data: facilitySegmentList } = useGetParameterList('facilitySegment', { label: 'value1', value: 'key' });
  const { data: dataOperationList } = useGetParameterList('dataOperation', { label: 'value1', value: 'key' });
  const { data: customerClassificationList } = useGetParameterList('customerClassification', { label: 'value1', value: 'key' });

  const { data: penjaminDetail } = useGetSlikPenjaminDetail({
    ...payloadFilterList(processId),
    facilityId: id,
  });

  useEffect(() => {
    const content = (penjaminDetail as any)?.data?.content;
    if (penjaminDetail) {
      reset({
        ...content,
        facilitySegmentDesc: facilitySegmentList?.find((item) => item.value === content?.facilitySegment)?.label || '',
        gurantorCodeDesc: customerClassificationList?.find((item) => item.value === content?.gurantorCode)?.label || '',
        identityType: content?.identityType !== null ? String(content?.identityType) : '',
        identityTypeDesc: gurantorCodeList?.find((item) =>
          item.value === (content?.identityType !== null ? String(content?.identityType) : ''))?.label || '',

      });
    }
  }, [penjaminDetail, reset, gurantorCodeList, facilitySegmentList, customerClassificationList]);

  const { mutate: savePenjamin } = useSaveSlikPenjamin({
    onError: (error: any) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(penjaminDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer slik penjamin ' + (isKonven ? 'konven' : 'syariah') + ' page',
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
        changeBefore: JSON.stringify(penjaminDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer slik penjamin ' + (isKonven ? 'konven' : 'syariah') + ' page',
      });
      showNiceModalV2(
        {
          title: 'Data berhasil disimpan',
          type: 'success',
        }
      );
    },
  });

  const handleSave = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          const payload = {
            ...getValues(),
            bucketProcessId: processId,
            facilityId: id,
            identityTypeRemark: watch('identityType') === '9' ? watch('identityTypeRemark') : '',
          };
          savePenjamin(payload);
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      const payload = {
        ...getValues(),
        bucketProcessId: processId,
        facilityId: id,
        identityTypeRemark: watch('identityType') === '9' ? watch('identityTypeRemark') : '',
      };
      savePenjamin(payload);
    }

  };

  const handleBackToListPage = () => {
    router.replace(replacePath(maintenanceDebtor.REGULATOR_DATA_SLIK_PAGE, {
      module: modul, processId,
    }));
  };

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: !isDebtor,
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetDeltaDetailSlik({
    bucketProcessId: processId,
    component: 'slik-facility-guarantor',
    facilityId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const delta = dataDelta?.data?.content;

  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; value: string}[]) => {
    let previousValue = null;
    if (delta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = delta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => item?.value === findPrevValues)?.label;
        } else {
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };

  return {
    control,
    customerClassificationList,
    dataOperationList,
    facilitySegmentList,
    findDataMaster,
    gurantorCodeList,
    handleBackToListPage,
    handleSave,
    isValid,
    isViewOnly,
    setValue,
    theme,
    watch,
  };
};
