import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetChangesDetail from '../../../../../ConventionalFacilityPage/hooks/useGetChangesDetail';
import useGetChildLimitOther from '../../../../hooks/useGetChildLimitOther';
import useSaveOtherTab from '../../../../hooks/useSaveOtherTab';

import { schema } from './LainnyaTab.schema';

import type { SubmitHandler } from 'react-hook-form';


const useLainnyaTab = () => {
  const { recordActivity } = useRecordLog();
  const params = useParams();
  const pathname = usePathname();
  const theme = useTheme();
  const { id, processId } = params;
  const path = usePathname();
  const pathArray = path.split('/');
  const isDetail = pathArray[8]?.includes('detail');
  const isEdit = pathArray[8]?.includes('edit');

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail manajemen fasilitas syariah informasi lainnya',
    });
  }, []);

  const isDisabled = useMemo(() => isDetail, [isDetail]);

  const { data: dataTabOther } = useGetChildLimitOther({
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
  })) || [], [sourceOfFundList]);

  const { data: branchList } = useGetParameterList('branch', { label: 'value1', module: 'value2', value: 'key' });
  const branchDropdownList = useMemo(() => branchList?.map((item: any) => ({
    ...item,
    id: item.value,
  })) || [], [branchList]);

  const methods = useForm({
    defaultValues: {
      accountOfficer: null,
      accountOfficerDivision: null,
      akadFinalDate: null,
      akadFinalNumber: null,
      akadInitialDate: null,
      akadInitialNumber: null,
      branchCode: null,
      childFacilityId: null,
      description: null,
      division: null,
      effectiveDate: null,
      facilityId: null,
      facilityNo: null,
      financingProvision: null,
      guaranteeOrAssignment: null,
      lastModified: null,
      modifiedBy: null,
      otherSourceOfFund: null,
      programSourceOfFund: null,
      relationshipManager: null,
      remarkSourceOfFund: null,
      sourceOfFund: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { control, formState: { isValid, errors }, handleSubmit } = methods;

  // Watch all form values untuk autosave
  const watchFields = methods.watch();

  useEffect(() => {
    methods.reset({
      accountOfficer: dataTabOther?.accountOfficer,
      accountOfficerDivision: dataTabOther?.accountOfficerDivision,
      akadFinalDate: dataTabOther?.akadFinalDate,
      akadFinalNumber: dataTabOther?.akadFinalNumber,
      akadInitialDate: dataTabOther?.akadInitialDate,
      akadInitialNumber: dataTabOther?.akadInitialNumber,
      branchCode: dataTabOther?.branchCode,
      childFacilityId: dataTabOther?.childFacilityId,
      description: dataTabOther?.description,
      division: dataTabOther?.division,
      effectiveDate: dataTabOther?.effectiveDate,
      facilityId: dataTabOther?.facilityId,
      facilityNo: dataTabOther?.facilityNo,
      financingProvision: dataTabOther?.financingProvision,
      guaranteeOrAssignment: dataTabOther?.guaranteeOrAssignment,
      lastModified: dataTabOther?.lastModified,
      modifiedBy: dataTabOther?.modifiedBy,
      otherSourceOfFund: dataTabOther?.otherSourceOfFund,
      programSourceOfFund: dataTabOther?.programSourceOfFund,
      relationshipManager: dataTabOther?.relationshipManager,
      remarkSourceOfFund: dataTabOther?.remarkSourceOfFund,
      sourceOfFund: dataTabOther?.sourceOfFund,
    });
  }, [dataTabOther]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const sanitizeValue = (value) => (value === null ? '' : value);
    const payload = {
      ...watchFields,
      bucketProcessId: processId as string,
      facilityId: id as string,
      otherSourceOfFund: sanitizeValue(watchFields.otherSourceOfFund),
      programSourceOfFund: sanitizeValue(watchFields.programSourceOfFund),
      sourceOfFund: sanitizeValue(watchFields.sourceOfFund),
    };

    return Promise.resolve(payload);
  }, [watchFields, processId, id]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isDisabled && isEdit,
    payload: autoSavePayload,
    url: 'master.facilityManagementSyariahExisiting.saveOther',
  });

  const { mutate: saveOtherTab, isPending: isSaving } = useSaveOtherTab({
    onError() {
      showNiceModalV2({
        onClose: () => { },
        type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => { },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  //const handleButtonSave = async () => { await methods.trigger().then((isValid) => handleSaveInformation(isValid)); };
  const onSubmit: SubmitHandler<LainnyaInterface> = (data) => {
    try {
      const payload = {
        ...data,
        bucketProcessId: processId as string,
        facilityId: id as string,
      };
      saveOtherTab(payload);

      recordActivity({
        activity: ActivityType.EDIT,
        changeAfter: JSON.stringify(dataTabOther),
        changeBefore: JSON.stringify(data),
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
        remarks: 'edit data in manajemen fasilitas syariah informasi lainnya',
      });
    } catch (e) {
      console.error(e);
    }
  };

  type Option = { label: string; id: string };

  const byValue = (v?: string, list?: Option[]) =>
    (v && list?.find((o) => o?.id === v)) ?? null;

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId as string,
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
          const foundItem = dropdownInputList?.find((item) => String(item?.id) === String(findPrevValues));
          previousValue = foundItem?.label ?? findPrevValues;
        } else {
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };

  return {
    branchDropdownList,
    byValue,
    control,
    dataTabOther,
    errors,
    findDataMaster,
    governmentMandateOptions,
    handleSubmit,
    isAutoSaveFetching,
    isDisabled,
    isSaving,
    isValid,
    methods,
    onSubmit,
    programSourceOfFundOptions,
    sourceOfFundOptions,
    theme,
    watchFields,
  };
};
export default useLainnyaTab;
