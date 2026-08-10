import { useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetOtherInformationDetail from '../../../../hooks/OtherInformation/useGetOtherInformation';
import useSaveOtherInformation from '../../../../hooks/OtherInformation/useSaveOtherInformation';
import useGetChangesDetail from '../../../../hooks/useGetChangesDetail';

import { schema } from './LainnyaTab.schema';


const useLainnyaTab = () => {
  const { id } = useParams();
  const { processId } = useIdentity();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('isEdit') === 'true';
  const { control, watch, reset, getValues, formState: { errors } } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const theme = useTheme();
  const isDisabled = !useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE) || !isEdit;
  const { recordActivity } = useRecordLog();
  const isOrderType = searchParams.get('orderType');

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi lainnya - tab lainnya',
    });
  }, []);

  const { data: lainnyaInformation } = useGetOtherInformationDetail(
    {
      ...payloadFilterList(processId as string),
      facilityId: id as string,
    }
  );
  const { data: facilityInformation } = useGetFacilityInformation({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  const { data: governmentMandateList } = useGetParameterList('governmentMandate');
  const governmentMandateOptions = useMemo(() => governmentMandateList.map((item) => ({
    ...item,
    id: item.label,
  })), [governmentMandateList]);

  const { data: programSourceOfFundList } = useGetParameterList('programSourceofFund');
  const programSourceOfFundOptions = useMemo(() => programSourceOfFundList.map((item) => ({
    ...item,
    id: item.label,
  })), [programSourceOfFundList]);

  const { data: sourceOfFundList } = useGetParameterList('projectSourceofFund');
  const sourceOfFundOptions = useMemo(() => sourceOfFundList?.map((item) => ({
    ...item,
    id: item.label,
  })), [sourceOfFundList]);

  useEffect(() => {
    if (lainnyaInformation) {
      reset(lainnyaInformation?.data?.content as any);
    }
  }, [lainnyaInformation]);

  const { mutate: saveLainnyaInformation, isPending: savingLainnyaInformation } = useSaveOtherInformation({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.EDIT,
        changeAfter: JSON.stringify(control._formValues),
        changeBefore: JSON.stringify(lainnyaInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'edit data error in manajemen fasilitas conventional informasi lainnya - tab lainnya',
      });
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: error?.message,
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.EDIT,
        changeAfter: JSON.stringify(control._formValues),
        changeBefore: JSON.stringify(lainnyaInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'edit data success in manajemen fasilitas conventional informasi lainnya - tab lainnya',
      });
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        title: 'Lainnya information berhasil disimpan',
      });
    },
  });

  const handleSaveLainnyaInformation = () => {
    const payload = {
      accountOfficer: getValues('accountOfficer'),
      accountOfficerDivision: getValues('accountOfficerDivision'),
      branchCode: getValues('branchCode'),
      bucketProcessId: processId,
      description: getValues('description'),
      effectiveDate: getValues('effectiveDate'),
      facilityId: id as string,
      finalContractDate: getValues('finalContractDate'),
      finalContractNumber: getValues('finalContractNumber'),
      guarantee: getValues('guarantee'),
      initialContractDate: getValues('initialContractDate'),
      initialContractNumber: getValues('initialContractNumber'),
      otherSourceOfFund: getValues('otherSourceOfFund'),
      programSourceOfFund: getValues('programSourceOfFund'),
      providingFinancing: getValues('providingFinancing'),
      remarkSourceOfFund: getValues('remarkSourceOfFund'),
      sourceOfFund: getValues('sourceOfFund'),

    };
    saveLainnyaInformation(payload);
  };

  type Option = { label: string; id: string };

  const byValue = (v?: string, list?: Option[]) =>
    (v && list?.find((o) => o?.id === v)) ?? null;

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { data: bucketDetail } = useGetBucketById({
    ...payloadFilterList(processId as string),
    // debtorId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetChangesDetail({
    // ...payloadFilterList(processId as string),
    bucketProcessId: processId as string,
    component: 'lainnya',
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
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };

  return {
    byValue,
    control,
    errors,
    facilityInformation,
    findDataMaster,
    governmentMandateOptions,
    handleSaveLainnyaInformation,
    isDisabled,
    isEdit,
    isOrderType,
    programSourceOfFundOptions,
    savingLainnyaInformation,
    sourceOfFundOptions,
    theme,
    watch,
  };
};

export default useLainnyaTab;
