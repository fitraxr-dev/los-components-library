import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import { apoloSchema } from './Apolo.constants';
import useGetDetailApolo from './hooks/useGetDetailApolo';
import useSaveDetailApolo from './hooks/useSaveDetailApolo';


const useApolo = () => {
  const { processId } = useIdentity();
  const isDebtor = processId?.includes('DEBT');
  const theme = useTheme();
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  const [{ stepper }] = useApp();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'regulator-data')?.enable;
  const canEdit = roleCanEdit && !isViewOnly;
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [isSubmit, setIsSubmit] = useState(false);
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer apolo page',
    });

    handleSetBreadcrumb([
      { label: 'Regulator Data', url: '' },
      { label: 'Apolo', url: '' }
    ]);
  }, []);

  const { control, getValues, setValue, formState: { isValid }, watch, reset } = useForm(
    {
      mode: 'onChange',
      resolver: yupResolver(apoloSchema),
    }
  );

  const { data: customerGroupData } = useGetParameterList(
    'customerClassification', { label: 'value1', value: 'key' });

  const { data: country } = useGetParameterList(
    'country', { label: 'value1', value: 'key' });

  const { data: apoloRelatedStatus } = useGetParameterList(
    'apoloRelatedStatus', { label: 'value1', value: 'key' });

  const { data: apoloRelatedParty } = useGetParameterList(
    'apoloRelatedParty', { label: 'value1', value: 'key' });

  const { data: businessCategory } = useGetParameterList(
    'businessCategory', { label: 'value1', value: 'key' });

  const { data: apoloFinanceCategory } = useGetParameterList(
    'apoloFinanceCategory', { label: 'value1', value: 'key' });

  const { data: economicSector } = useGetParameterList(
    'economicSectorapolo', { label: 'value1', value: 'key' });

  const { data: financingObject } = useGetParameterList(
    'financingObject', { label: 'value1', value: 'key' });

  const { data: locationProject } = useGetParameterList(
    'projectLocationapolo', { label: 'value1', value: 'key' });

  const { data: apoloDetail } = useGetDetailApolo(
    payloadFilterList(processId));

  useEffect(() => {
    const data = (apoloDetail as any)?.data?.content;
    let body = {};
    if (data !== null) {
      body = {
        ...data,
        businessCategoryDescription: businessCategory?.find((item) => item.value === data?.businessCategory)?.label,
        countryDesc: country?.find((item) => item.value === data?.country)?.label,
        economicSectorDescription: economicSector?.find((item) => item.value === data?.economicSector)?.label,
        financeCategoryDescription: apoloFinanceCategory?.find((item) => item.value === data?.financeCategory)?.label,

        financingObjectDescription: financingObject?.find((item) => item.value === data?.financingObject)?.label,

        groupCustomerCode: customerGroupData?.find((item) => item.value === data?.customerGroup)?.value,

        groupCustomerDescription: customerGroupData?.find((item) => item.value === data?.customerGroup)?.label,

        projectCityDescription: locationProject?.find((item) => item.value === data?.projectCity)?.label,

        relatedPartyRelationshipDescription: apoloRelatedParty?.find((item) =>
          item.value === data?.relatedPartyRelationship)?.label,
        relatedStatusDescription: apoloRelatedStatus?.find((item) =>
          item.value === data?.relatedStatus)?.label,
      };
      reset(body);
    }
  }, [
    apoloDetail,
    reset,
    apoloRelatedStatus,
    apoloRelatedParty,
    businessCategory,
    apoloFinanceCategory,
    economicSector,
    locationProject,
    financingObject,
  ]);

  const { mutate: saveDetailApolo } = useSaveDetailApolo({
    onError: (error: any) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(apoloDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer apolo page',
      });
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: error?.message,
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(apoloDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer apolo page',
      });
      if (!isSubmit) {
        NiceModal.show(MODAL.GLOBAL.SUCCESS, {
          title: 'Detail Apolo berhasil disimpan',
        });
      }
      setIsSubmit(false);
    },
  });

  const handleSaveDetailApolo = (value: boolean) => {
    console.log('value', value);
    setIsSubmit(value);
    if (!isValid && !value) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveDetailApolo({
            bucketProcessId: processId,
            businessCategory: getValues('businessCategory'),
            country: getValues('country'),
            customerGroup: getValues('groupCustomerCode'),
            economicSector: getValues('economicSector'),
            economicSectorRemark: getValues('economicSectorRemark'),
            financeCategory: getValues('financeCategory'),
            financingObject: getValues('financingObject'),
            financingObjectRemark: getValues('financingObjectRemark'),
            financingType: getValues('financingType'),
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CUSTOMER,
            projectCity: getValues('projectCity'),
            projectCityRemark: getValues('projectCityRemark'),
            relatedPartyRelationship: getValues('relatedPartyRelationship'),
            relatedStatus: getValues('relatedStatus'),
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveDetailApolo({
        bucketProcessId: processId,
        businessCategory: getValues('businessCategory'),
        country: getValues('country'),
        customerGroup: getValues('groupCustomerCode'),
        economicSector: getValues('economicSector'),
        economicSectorRemark: getValues('economicSectorRemark'),
        financeCategory: getValues('financeCategory'),
        financingObject: getValues('financingObject'),
        financingObjectRemark: getValues('financingObjectRemark'),
        financingType: getValues('financingType'),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        projectCity: getValues('projectCity'),
        projectCityRemark: getValues('projectCityRemark'),
        relatedPartyRelationship: getValues('relatedPartyRelationship'),
        relatedStatus: getValues('relatedStatus'),
      });
    }
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


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: 'apolo',
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: { label: string; value: string }[]) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
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

  // Memoize watched values
  const watchedValues = useMemo(() => ({
    businessCategory: watch('businessCategory'),
    economicSector: watch('economicSector'),
    economicSectorRemark: watch('economicSectorRemark'),
    financeCategory: watch('financeCategory'),
    financingObject: watch('financingObject'),
    financingObjectRemark: watch('financingObjectRemark'),
    financingType: watch('financingType'),
    projectCity: watch('projectCity'),
    projectCityRemark: watch('projectCityRemark'),
    relatedPartyRelationship: watch('relatedPartyRelationship'),
    relatedStatus: watch('relatedStatus'),
  }), [
    watch('businessCategory'),
    watch('economicSector'),
    watch('economicSectorRemark'),
    watch('financeCategory'),
    watch('financingObject'),
    watch('financingObjectRemark'),
    watch('financingType'),
    watch('projectCity'),
    watch('projectCityRemark'),
    watch('relatedPartyRelationship'),
    watch('relatedStatus'),
  ]);

  // Auto-save payload generator
  const autoSavePayload = useMemo(() => () => {
    const formattedPayload = {
      bucketProcessId: processId,
      businessCategory: watchedValues.businessCategory,
      economicSector: watchedValues.economicSector,
      economicSectorRemark: watchedValues.economicSectorRemark,
      financeCategory: watchedValues.financeCategory,
      financingObject: watchedValues.financingObject,
      financingObjectRemark: watchedValues.financingObjectRemark,
      financingType: watchedValues.financingType,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      projectCity: watchedValues.projectCity,
      projectCityRemark: watchedValues.projectCityRemark,
      relatedPartyRelationship: watchedValues.relatedPartyRelationship,
      relatedStatus: watchedValues.relatedStatus,
    };

    return Promise.resolve(formattedPayload);
  }, [processId, watchedValues]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: canEdit && !!apoloDetail,
    payload: autoSavePayload,
    url: 'master.regulatorData.saveApolo',
  });

  return {
    apoloFinanceCategory,
    apoloRelatedParty,
    apoloRelatedStatus,
    businessCategory,
    canEdit,
    control,
    country,
    customerGroupData,
    debtorData,
    economicSector,
    financingObject,
    findDataMaster,
    getValues,
    handleSaveDetailApolo,
    isAutoSaveFetching,
    isDebtor,
    isSubmit,
    isValid,
    locationProject,
    setIsSubmit,
    setValue,
    theme,
    watch,
  };
};

export default useApolo;
