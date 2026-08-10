import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetDetailGeneralInformation from '@/hooks/services/maintenance-customer/useGetGeneralInformationDetail';
import useSaveGeneralInformation from '@/hooks/services/maintenance-customer/useSaveGeneralInformation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { parsePhoneFields, serializePhoneFields } from '@/hooks/useParsePhoneNumber';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { generalInformationSchema } from './GeneralInformation.constant';


const useGeneralInformation = () => {
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useCustomRouter();
  const [{ stepper, currentRole }] = useApp();
  const { setDirtyMsg } = useContext(DirtyContext);
  const pathname = usePathname();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const [filteredOwnership, setFilteredOwnership] = useState([]);
  const [filteredPurpose, setFilteredPurpose] = useState([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const isDebtor = processId?.includes('DEBT');
  const queryClient = useQueryClient();

  const [isSubmit, setIsSubmit] = useState(false);

  // const isTL = currentRole.includes('TL');
  // const isKadiv = currentRole.includes('KADIV');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { recordActivity } = useRecordLog();

  const [actions, setActions] = useState(null);


  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !isDebtor });

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  const { data } = useGetDetailGeneralInformation({
    bucketProcessId: isDebtor ? null : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: isDebtor ? !!processId : !!bucketDetail?.debtorId });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum?.GeneralInformation,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });


  const { mutate, isPending } = useSaveGeneralInformation({
    onError: () => {
      showNiceModalV2({
        title: 'Data tidak valid',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues('generalInformation')),
        changeBefore: JSON.stringify(data),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save maintenance customer general information',
      });

      queryClient.invalidateQueries({ queryKey: ['detail-maintenance-customer-general-info']});

      if (!isSubmit) {
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
      setIsSubmit(false);
    },
  });


  const {
    control,
    formState: {
      errors,
      isDirty,
      isValid,
    },
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
  } = useForm({
    context: 'generalInformation',
    mode: 'onChange',
    resolver: yupResolver(generalInformationSchema),
  });

  const watchedGeneralInformation = watch('generalInformation');

  const checkFormDirty = () => {
    if (!data) return false;

    const currentValues = getValues('generalInformation');
    if (!currentValues) return false;

    const normalizeValue = (value: unknown, isObjectWithValue = false): unknown => {
      if (value === '' || value === null || value === undefined) return null;
      if (Array.isArray(value) && value.length === 0) return null;

      if (isObjectWithValue && value && typeof value === 'object' && 'value' in value) {
        const extracted = (value as { value: unknown }).value;
        return extracted === null || extracted === undefined ? null : extracted;
      }

      return value;
    };

    const normalizeBoolean = (value: unknown): string | null => {
      if (value === true || value === 'true') return 'true';
      if (value === false || value === 'false') return 'false';
      return null;
    };

    const objectFields = [
      'province',
      'city',
      'district',
      'subDistrict',
      'country',
      'nationality',
      'infrastructureSector'
    ];
    const booleanFields = ['goPublic', 'isGroup', 'isRelatedSmi'];
    const arrayFields = ['language'];

    const fieldsToCompare = [
      ...objectFields,
      ...booleanFields,
      ...arrayFields,
      'customerName',
      'alias',
      'address',
      'postalCode',
      'email',
      'website',
      'contactPerson',
      'emailContactPerson',
      'positionContactPerson',
      'customerRemark',
      'institutionType',
      'debtorType',
      'debtorOwnerships',
      'debtorPurpose',
      'defineSector',
      'dataSource',
      'branchCode'
    ];

    for (const field of fieldsToCompare) {
      const originalValue = data[field];
      const currentValue = currentValues[field];

      let normalizedOriginal: unknown;
      let normalizedCurrent: unknown;

      if (booleanFields.includes(field)) {
        normalizedOriginal = normalizeBoolean(originalValue);
        normalizedCurrent = normalizeBoolean(currentValue);
      } else if (arrayFields.includes(field)) {
        normalizedOriginal = normalizeValue(originalValue);
        normalizedCurrent = normalizeValue(currentValue);

        if (normalizedOriginal === null && normalizedCurrent === null) continue;

        if (!isEqual(normalizedOriginal, normalizedCurrent)) return true;
        continue;
      } else {
        const isObjectField = objectFields.includes(field);
        normalizedOriginal = normalizeValue(originalValue, false);
        normalizedCurrent = normalizeValue(currentValue, isObjectField);
      }

      if (normalizedOriginal !== normalizedCurrent) return true;
    }

    return false;
  };

  useEffect(() => {
    if (!isFormInitialized) return;

    const isFormDirty = checkFormDirty();

    if (!isViewOnly && roleCanEdit && isFormDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [data, isDirty, watchedGeneralInformation, isFormInitialized]);

  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    if (isValid) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [watchedGeneralInformation, isValid, errors, isDirty]);

  useEffect(() => {
    for (const step of stepper.steps) {
      if ('childrenSteps' in step) {
        if (step.childrenSteps) {
          if (step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname))) {
            const actions = step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname));
            setActions(actions);
            break;
          }
        }
        else {
          if (step.urlPath === getLastPath(pathname)) {
            const actions = step;
            setActions(actions);
            break;
          }
        }
      }
    }
  }, [stepper]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer general information page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'General Information', url: '' }
    ]);
  }, []);

  const options = { label: 'value1', module: 'value2', value: 'key' };
  const { data: institutionTypeList } = useGetParameterList('institutionType');
  const { data: dataSourceDropdownList } = useGetParameterList('datasource');
  const { data: sectorDropdownList } = useGetParameterList('sector', options);
  const { data: provinceDropdownList } = useGetParameterList('province', options);
  const goPublicList = [
    { label: 'Ya', value: 'true' },
    { label: 'Tidak', value: 'false' }
  ];
  const { data: companyType } = useGetParameterList('debtorType');
  const { data: ownedByList } = useGetParameterList('ownership', options);
  const { data: purposeDropdownList } = useGetParameterList('purpose', { ...options, value3: 'value3' });
  const { data: relatedPartyList } = useGetParameterList('relatedParty', options);
  const { data: languageDropdownList } = useGetParameterList('language', options);
  const { data: nationalityDropdownList } = useGetParameterList('nationality', options);
  const { data: positionDropdownList } = useGetParameterList('jobPosition', options);
  const { data: countryDropdownList } = useGetParameterList('country', options);
  const { data: branchDropdownList } = useGetParameterList('branch', options);
  const { data: countryCodeList } = useGetParameterList('countryCode', options);

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer',
      });
      setDirtyMsg(undefined);

      showNiceModalV2({
        onClose: handleBackToListPage,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  // Condition country
  const otherCountry = useMemo(() => {
    if (!!watch('generalInformation.country') && countryDropdownList?.length) {
      const isOtherCountry = getValues('generalInformation.country')?.value !== 'ID';
      return isOtherCountry;
    }
  }, [watch('generalInformation.country')]);

  useEffect(() => {
    if (otherCountry) {
      const selectCountry = countryDropdownList?.find((item) => item.value === getValues('generalInformation.country')?.value);
      setValue('generalInformation.province', otherCountry ? selectCountry?.label : null);
      setValue('generalInformation.city', otherCountry ? selectCountry?.label : null);
      setValue('generalInformation.district', otherCountry ? selectCountry?.label : null);
      setValue('generalInformation.subDistrict', otherCountry ? selectCountry?.label : null);
    }
  }, [watch('generalInformation.country'), otherCountry]);

  const checkingTypeOfData = (data) => {
    const checkedData = data ? (typeof data === 'object' ? data?.value : data) : null;
    return checkedData;
  };

  const checkingTypeOfDataNationality = (data, list) => {
    let checkedData;
    if (typeof data === 'object') {
      checkedData = data?.value;
    } else {
      checkedData = list?.find((item) => item?.value?.includes(data))?.value;
    }
    return checkedData;
  };


  useEffect(() => {
    if (data) {
      setIsFormInitialized(false);

      let body = {};
      const fields = generalInformationSchema.fields;
      for (const key in fields.generalInformation.fields) {
        if (
          ['telephone', 'cellularContactPerson', 'officeCellular', 'officeCellularContactPerson', 'nationality', 'country'].includes(key)
        ) {
          body[key] = parsePhoneFields(data[key]);
          if (key === 'nationality') {
            body[key] = nationalityDropdownList?.find((item) =>
              item?.value === data[key]) ?? { label: null, module: null, value: null };
          }
          if (key === 'country') {
            const findCountry = countryDropdownList?.find((item) => item?.value === data[key]);
            body[key] = findCountry;
          }
        } else {
          if (typeof data[key] === 'boolean') {
            body[key] = data[key] ? 'true' : 'false';
          } else {
            body[key] = data[key] ?? null;
          }
        }
      }

      reset({
        generalInformation: body,
      });

      setIsFormInitialized(true);
    }

  }, [data, reset, nationalityDropdownList, countryDropdownList]);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'General Information', url: '' }
    ]);
  }, []);

  // Condition customer category
  useEffect(() => {
    if (!!watch('generalInformation.institutionType') && ownedByList?.length) {
      setFilteredOwnership(ownedByList?.filter((item) => item.module?.includes(getValues('generalInformation.institutionType'))));
    }

    if (!!watch('generalInformation.institutionType') && !!watch('generalInformation.debtorOwnerships') && purposeDropdownList?.length) {
      setFilteredPurpose(purposeDropdownList?.filter((item) =>
        item.module?.includes(getValues('generalInformation.institutionType')) &&
        item.value3?.includes(getValues('generalInformation.debtorOwnerships'))));
    }
  }, [ownedByList, purposeDropdownList, watch('generalInformation.institutionType'), watch('generalInformation.debtorOwnerships')]);

  // onChange city by province
  const cityModule = useMemo(() => {
    const provinceValue = checkingTypeOfData(watch('generalInformation.province'));
    const cityData = provinceDropdownList?.find((item) => item.value === provinceValue)?.module;
    return cityData;
  }
  , [provinceDropdownList, watch('generalInformation.province')]);

  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  });

  // onChange district by city
  const districtModule = useMemo(() => {
    const cityValue = checkingTypeOfData(watch('generalInformation.city'));
    const districtData = cityDropdownList?.find((item) => item.value === cityValue)?.module;
    return districtData;
  }, [cityDropdownList, watch('generalInformation.city')]);

  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  });

  // onChange subDistrict by district
  const subDistrictModule = useMemo(() => {
    const districtValue = checkingTypeOfData(watch('generalInformation.district'));
    const subDistrictData = districtDropdownList?.find((item) => item.value === districtValue)?.module;
    return subDistrictData;
  }, [districtDropdownList, watch('generalInformation.district')]);

  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  });

  // onChange postalCode by subDistrict
  useEffect(() => {
    const subDistrictValue = checkingTypeOfData(watch('generalInformation.subDistrict'));
    const postCodeData = subDistrictDropdownList?.find((item) => item.value === subDistrictValue)?.module;
    const value = (otherCountry && !!watch('generalInformation.subDistrict')) ? '00000' : postCodeData;
    setValue('generalInformation.postalCode', value);
  }, [subDistrictDropdownList, watch('generalInformation.subDistrict')]);

  const handleSave = () => {
    const payload = getValues('generalInformation');
    mutate({
      address: payload.address,

      alias: payload.alias,


      branchCode: payload.branchCode,


      bucketProcessId: processId,

      cellularContactPerson: serializePhoneFields(payload.cellularContactPerson),

      city: payload.city?.value ?? payload.city,

      contactPerson: payload.contactPerson,

      country: payload.country?.value ?? payload.country,

      customerName: payload.customerName,

      customerRemark: payload.customerRemark,
      // debtorId: string;
      dataSource: payload.dataSource,
      debtorOwnerships: payload.debtorOwnerships,
      debtorPurpose: payload.debtorPurpose,
      debtorType: payload.debtorType,
      defineSector: payload.defineSector,
      district: payload.district?.value ?? payload.district,
      email: payload.email,
      emailContactPerson: payload.emailContactPerson,
      goPublic: payload.goPublic === 'true',
      infrastructureSector: payload.infrastructureSector?.value ?? payload.infrastructureSector,
      institutionType: payload.institutionType,
      isGroup: payload.isGroup === 'true',

      isRelatedSmi: payload.isRelatedSmi === 'true',


      language: payload.language,


      module: TypeModule.MAINTENANCE_DATA,

      nationality: payload.nationality?.value ?? null,

      officeCellular: serializePhoneFields(payload.officeCellular),

      officeCellularContactPerson: serializePhoneFields(payload.officeCellularContactPerson),

      positionContactPerson: payload.positionContactPerson,

      // village: payload.subDistrict.value,
      postalCode: payload.postalCode,

      process: TypeProcess.MAINTENANCE_CUSTOMER,
      province: payload.province?.value ?? payload.province,
      subDistrict: payload.subDistrict?.value ?? payload.subDistrict,
      telephone: serializePhoneFields(payload.telephone),
      website: payload.website,
    });
  };

  const handleInvalid = () => {
    const payload = getValues('generalInformation');
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      onSubmit: () => {
        mutate({
          address: payload.address,

          alias: payload.alias,


          branchCode: payload.branchCode,


          bucketProcessId: processId,

          cellularContactPerson: serializePhoneFields(payload.cellularContactPerson),

          city: payload.city?.value ?? payload.city,

          contactPerson: payload.contactPerson,

          country: payload.country?.value ?? payload.country,

          customerName: payload.customerName,

          customerRemark: payload.customerRemark,
          // debtorId: string;
          dataSource: payload.dataSource,
          debtorOwnerships: payload.debtorOwnerships,
          debtorPurpose: payload.debtorPurpose,
          debtorType: payload.debtorType,
          defineSector: payload.defineSector,
          district: payload.district?.value ?? payload.district,
          email: payload.email,
          emailContactPerson: payload.emailContactPerson,
          goPublic: payload.goPublic === 'true',
          infrastructureSector: payload.infrastructureSector?.value ?? payload.infrastructureSector,
          institutionType: payload.institutionType,
          isGroup: payload.isGroup === 'true',

          isRelatedSmi: payload.isRelatedSmi === 'true',


          language: payload.language,


          module: TypeModule.MAINTENANCE_DATA,

          nationality: payload.nationality.value ?? payload.nationality,

          officeCellular: serializePhoneFields(payload.officeCellular),

          officeCellularContactPerson: serializePhoneFields(payload.officeCellularContactPerson),

          positionContactPerson: payload.positionContactPerson,

          // village: payload.subDistrict.value,
          postalCode: payload.postalCode,

          process: TypeProcess.MAINTENANCE_CUSTOMER,
          province: payload.province.value ?? payload.province,
          subDistrict: payload.subDistrict.value ?? payload.subDistrict,
          telephone: serializePhoneFields(payload.telephone),
          website: payload.website,
        });
      },
      title: 'Data belum lengkap, apakah Anda ingin menyimpan data ini?',
    });
  };


  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: async ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          try {
            submitBucket({
              submitRequestDto: {
                action: radioValue,
                bucketProcessId: String(processId),
                comment,
                module: TypeModule.MAINTENANCE_DATA,
                process: TypeProcess.MAINTENANCE_CUSTOMER,
              },
            });
          } catch (error) {
            NiceModal.show(MODAL.GLOBAL.ERROR, {
              message: 'Error',
              title: 'Error',
            });
          }
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: CANCELED },
          { label: 'Rejected', value: REJECTED }
        ],
      });
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: async ({ comment }) => {
          try {
            setIsSubmit(true);
            submitBucket({
              submitRequestDto: {
                action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.MAINTENANCE_DATA,
                process: TypeProcess.MAINTENANCE_CUSTOMER,
              },
            });
          } catch (error) {
            NiceModal.show(MODAL.GLOBAL.ERROR, {
              message: 'Error',
              title: 'Error',
            });
          }
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };


  const handleSubmitProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: async ({ comment }) => {
        try {
          setIsSubmit(true);
          submitBucket({
            submitRequestDto: {
              action: 'SUBMIT',
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        } catch (error) {
          NiceModal.show(MODAL.GLOBAL.ERROR, {
            message: 'Error',
            title: 'Error',
          });
        }

        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };


  const handleDeclineProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CUSTOMER,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED }
      ],
    });
  };

  const handleBackToListPage = () => {
    router.replace(maintenanceDebtor.LIST_PAGE);
  };

  const formatString = (val) => {
    let label = '';
    if (typeof val === 'object' && val !== null) {
      label = val?.value?.toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
    } else {
      if (val?.length) {
        label = val.toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
          .join(' ');
      }
    }

    return label;
  };


  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; value: string}[]) => {
    let previousValue = null;
    if (inputKey.includes('.')) {
      const [key, subKey] = inputKey.split('.');
      if (dataDelta?.differencesData?.some((el) => el?.field === key) && isSuccesDataDelta) {
        let findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === key)?.previousValue;
        if (findPrevValues === null) {
          previousValue = '-';
        } else {
          previousValue = parsePhoneFields(findPrevValues)[subKey];
        }
      }
    } else {
      if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
        const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
        if (findPrevValues === null) {
          previousValue = '-';
        } else {
          if (dropdownInputList?.length) {
            previousValue = dropdownInputList?.find((item) => {
              const prevValue = findPrevValues;
              if (typeof prevValue === 'boolean') {

                return item?.value === (prevValue as Boolean).toString();
              } else {
              // @ts-expect-error: possible type mismatch between item.value and prevValue
                return item?.value === prevValue;
              }
            })?.label || '-';
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    if (inputKey === 'city' || inputKey === 'district' || inputKey === 'subDistrict') {
    }
    return previousValue;
  };

  // onChange city by province
  const cityModuleMaster = useMemo(() => {
    const provinceValue = checkingTypeOfData(dataDelta?.differencesData?.find((el) => el?.field === 'province')?.previousValue);
    const cityData = provinceDropdownList?.find((item) => item.value === provinceValue)?.module;
    return cityData;
  }
  , [provinceDropdownList, dataDelta?.differencesData?.find((el) => el?.field === 'province')?.previousValue]);

  const { data: cityDropdownListMaster } = useGetParameterList(cityModuleMaster, {
    ...options, config:
      { enabled: !!cityModuleMaster },
  });

  // onChange district by city
  const districtModuleMaster = useMemo(() => {
    const cityValue = checkingTypeOfData(dataDelta?.differencesData?.find((el) => el?.field === 'city')?.previousValue);
    const districtData = cityDropdownListMaster?.find((item) => item.value === cityValue)?.module;
    return districtData;
  }, [cityDropdownListMaster, dataDelta?.differencesData?.find((el) => el?.field === 'city')?.previousValue]);

  const { data: districtDropdownListMaster } = useGetParameterList(districtModuleMaster, {
    ...options, config:
      { enabled: !!districtModuleMaster },
  });

  // onChange subDistrict by district
  const subDistrictModuleMaster = useMemo(() => {
    const districtValue = checkingTypeOfData(dataDelta?.differencesData?.find((el) => el?.field === 'district')?.previousValue);
    const subDistrictData = districtDropdownListMaster?.find((item) => item.value === districtValue)?.module;
    return subDistrictData;
  }, [districtDropdownListMaster, dataDelta?.differencesData?.find((el) => el?.field === 'district')?.previousValue]);

  const { data: subDistrictDropdownListMaster } = useGetParameterList(subDistrictModuleMaster, {
    ...options, config:
      { enabled: !!subDistrictModuleMaster },
  });

  const [masterCity, setMasterCity] = useState(null);
  const [masterDistrict, setMasterDistrict] = useState(null);
  const [masterSubDistrict, setMasterSubDistrict] = useState(null);

  useEffect(() => {
    if (cityDropdownListMaster.length > 0) {
      setMasterCity(findDataMaster('city', cityDropdownListMaster));
    }
    if (districtDropdownListMaster.length > 0) {
      setMasterDistrict(findDataMaster('district', districtDropdownListMaster));
    }
    if (subDistrictDropdownListMaster.length > 0) {
      setMasterSubDistrict(findDataMaster('subDistrict', subDistrictDropdownListMaster));
    }

  }, [cityDropdownListMaster, districtDropdownListMaster, subDistrictDropdownListMaster]);

  // Auto-save
  const autoSavePayload = useMemo(() => () => {
    const payload = getValues('generalInformation');

    if (!payload) return Promise.resolve(null);

    const formattedPayload = {
      address: payload.address,
      alias: payload.alias,
      branchCode: payload.branchCode,
      bucketProcessId: processId,
      cellularContactPerson: serializePhoneFields(payload.cellularContactPerson),
      city: payload.city?.value ?? payload.city,
      contactPerson: payload.contactPerson,
      country: payload.country?.value ?? payload.country,
      customerName: payload.customerName,
      customerRemark: payload.customerRemark,
      dataSource: payload.dataSource,
      debtorOwnerships: payload.debtorOwnerships,
      debtorPurpose: payload.debtorPurpose,
      debtorType: payload.debtorType,
      defineSector: payload.defineSector,
      district: payload.district?.value ?? payload.district,
      email: payload.email,
      emailContactPerson: payload.emailContactPerson,
      goPublic: payload.goPublic === 'true',
      infrastructureSector: payload.infrastructureSector?.value ?? payload.infrastructureSector,
      institutionType: payload.institutionType,
      isGroup: payload.isGroup === 'true',
      isRelatedSmi: payload.isRelatedSmi === 'true',
      language: payload.language,
      module: TypeModule.MAINTENANCE_DATA,
      nationality: payload.nationality?.value ?? null,
      officeCellular: serializePhoneFields(payload.officeCellular),
      officeCellularContactPerson: serializePhoneFields(payload.officeCellularContactPerson),
      positionContactPerson: payload.positionContactPerson,
      postalCode: payload.postalCode,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      province: payload.province?.value ?? payload.province,
      subDistrict: payload.subDistrict?.value ?? payload.subDistrict,
      telephone: serializePhoneFields(payload.telephone),
      website: payload.website,
    };

    return Promise.resolve(formattedPayload);
  }, [
    processId,
    watchedGeneralInformation,
  ]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && roleCanEdit,
    payload: autoSavePayload,
    url: 'master.generalInformation.save',
  });


  const handleClose = () => {
    router.back();
  };
  return {
    actions,
    branchDropdownList,
    canEdit,
    cityDropdownList,
    companyType,
    control,
    countryCodeList,
    countryDropdownList,
    dataSourceDropdownList,
    debtorData,
    districtDropdownList,
    filteredOwnership,
    filteredPurpose,
    findDataMaster,
    formatString,
    goPublicList,
    handleBackToListPage,
    handleClose,
    handleDeclineProcess,
    handleInvalid,
    handleOpenSubmitModal,
    handleSave,
    handleSubmit,
    handleSubmitProcess,
    institutionTypeList,
    isAutoSaveFetching,
    isDebtor,
    isDirty,
    isPending,
    isSubmit,
    isSubmitLoading,
    isViewOnly,
    languageDropdownList,
    masterCity,
    masterDistrict,
    masterSubDistrict,
    nationalityDropdownList,
    otherCountry,
    ownedByList,
    positionDropdownList,
    provinceDropdownList,
    purposeDropdownList,
    relatedPartyList,
    roleCanEdit,
    sectorDropdownList,
    setIsSubmit,
    setValue,
    subDistrictDropdownList,
    watch,
  };
};

export default useGeneralInformation;
