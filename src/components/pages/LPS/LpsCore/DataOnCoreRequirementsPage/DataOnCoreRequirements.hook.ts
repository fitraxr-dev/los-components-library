import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useUpdateDataOnCoreRequirementsResult from '@/hooks/services/master/debtor/useUpdateDataOnCoreRequirementsResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import { parsePhoneFields } from '@/hooks/useParsePhoneNumber';
import useRecordLog from '@/hooks/useRecordLog';

import { TABS } from './DataOnCoreRequirements.constants';
import useGetDataOnCoreRequirements from './hooks/useGetDataOnCoreRequirements';


const useDataOnCoreRequirements = () => {
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const goToNextStep = useGoToNextStep();
  const { recordActivity } = useRecordLog();
  const [activeTab, setActiveTab] = useState<string>(TABS.CUSTOMER_INFO);
  const [isNotValidForm, setIsNotValidForm] = useState<boolean>(false);

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  const methods = useForm({
    defaultValues: {
      address: null,
      aliasName: null,
      branchCode: null,
      businessCategory: null,
      cif: null,
      city: null,
      contactPerson: null,
      country: null,
      customerCategory: null,
      customerGroup: null,
      debtorName: null,
      debtorPurposeLabel: null,
      debtorTypeLabel: null,
      district: null,
      establishmentDate: null,
      establishmentPlace: null,
      infrastructureSector: null,
      kotaCabang: null,
      notaryDeedNumber: null,
      npwp: null,
      officeCellular: null,
      positionContactPerson: null,
      postalCode: null,
      province: null,
      relation: null,
      subDistrict: null,
      telephone: null,
    },
  });

  const { data, isSuccess, isLoading, isFetching } = useGetDataOnCoreRequirements({
    bucketProcessId: processId,
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'view data on core requirements page',
      });
    }
  }, [isLoading, isFetching, processId, recordActivity]);

  useEffect(() => {
    if (data && isSuccess) {
      methods.reset({
        address: data?.address,
        aliasName: data?.aliasName,
        branchCode: data?.branchCodeLabel,
        businessCategory: data?.businessCategory,
        cif: data?.cif,
        city: data?.city,
        contactPerson: data?.contactPerson,
        country: data?.country,
        customerCategory: data?.customerCategory,
        customerGroup: data?.customerGroup,
        debtorName: data?.debtorName,
        debtorPurposeLabel: data?.debtorPurposeLabel,
        debtorTypeLabel: data?.debtorTypeLabel,
        district: data?.district,
        establishmentDate: data?.establishmentDate,
        establishmentPlace: data?.establishmentPlace,
        infrastructureSector: data?.infrastructureSector,
        kotaCabang: data?.kotaCabang,
        notaryDeedNumber: data?.notaryDeedNumber,
        npwp: data?.npwp,
        officeCellular: parsePhoneFields(data?.officeCellular),
        positionContactPerson: data?.positionContactPerson,
        postalCode: data?.postalCode,
        province: data?.province,
        relation: data?.relation,
        subDistrict: data?.subDistrict,
        telephone: parsePhoneFields(data?.telephone),
      });

      validateMandatoryFields(data);
    }
  }, [data]);

  const { mutate: updateDataOnCoreRequirementsResult } =
    useUpdateDataOnCoreRequirementsResult();

  useEffect(() => {
    if (debtorInfoData?.debtorId) {
      updateDataOnCoreRequirementsResult({
        debtorId: debtorInfoData?.debtorId,
        isAlertShow: isNotValidForm,
      });
    }
  }, [isNotValidForm, debtorInfoData?.debtorId, updateDataOnCoreRequirementsResult]);

  const validateMandatoryFields = (formData: any) => {
    const mandatoryFields = [
      'debtorName',
      'relation',
      'businessCategory',
      'contactPerson',
      'positionContactPerson',
      'infrastructureSector',
      'branchCode',
      'address',
      'country',
      'province',
      'city',
      'district',
      'subDistrict',
      'postalCode',
      'npwp',
      'notaryDeedNumber',
      'establishmentDate',
      'establishmentPlace',
      'telephone',
    ];

    const isAnyMandatoryFieldEmpty = mandatoryFields.some((field) => {
      const value = formData?.[field];
      return value === null || value === undefined || value === '';
    });

    setIsNotValidForm(isAnyMandatoryFieldEmpty);
  };

  useEffect(() => {
    const subscription = methods.watch((value) => {
      validateMandatoryFields(value);
    });

    return () => subscription.unsubscribe();
  }, [methods.watch]);

  const handleNext = () => {
    queryClient.invalidateQueries({
      queryKey: ['bucket-stepper', { bucketProcessId: processId }],
    });
    goToNextStep();
  };

  const onSubmit = () => {
    if (activeTab === TABS.CUSTOMER_INFO) {
      setActiveTab(TABS.MANAGEMENT_SHAREHOLDER);
    } else if (activeTab === TABS.MANAGEMENT_SHAREHOLDER) {
      handleNext();
    }
  };

  const handleRouteMaintenanceDebitor = () => {
    const path = replacePath(
      maintenanceDebtor.CUSTOMER_INFORMATION_PREVIEW_PAGE,
      {
        debtorId: debtorInfoData?.debtorId,
        module: 'maintenance',
      }
    );

    window.open(path, '_blank', 'noopener, noreferrer');
  };

  return {
    activeTab,
    handleRouteMaintenanceDebitor,
    isNotValidForm,
    methods,
    onSubmit,
    setActiveTab,
  };
};

export default useDataOnCoreRequirements;
