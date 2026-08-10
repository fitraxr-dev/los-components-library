import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DECLINE, ONE_MINUTE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaIsoString, formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { serializePhoneFields } from '@/hooks/useParsePhoneNumber';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetManagement from '../../../hooks/useGetManagementById';
import useSaveManagement from '../../../hooks/useSaveManagement';

import { validationSchema } from './ManagementDetailForm.form';


const useManagementDetailForm = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const pathname = usePathname();
  const [{ currentRole }] = useApp();
  const router = useCustomRouter();
  const { processId, debtorId } = useIdentity();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isTL = currentRole.includes('TL');
  const isKadiv = currentRole.includes('KADIV');

  const isDebtor = processId?.includes('DEBT');
  const { recordActivity } = useRecordLog();

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const { data } = useGetManagement({
    bucketProcessId: isDebtor ? '' : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    managementCode: id,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });


  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum?.Management,
    componentIdentifier: String(id),
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const { getValues, control, watch, setValue, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      address: undefined,
      city: undefined,
      country: undefined,
      district: undefined,
      districtLocation: undefined,
      dob: undefined,
      ethnicOrigin: undefined,
      gender: undefined,
      idNo: undefined,
      idType: undefined,
      identityExpiry: undefined,
      jobPosition: undefined,
      ktpFile: undefined,
      managementCode: undefined,
      modifiedBy: undefined,
      modifiedDate: undefined,
      name: undefined,
      nationality: undefined,
      npwp: undefined,
      npwpFile: undefined,
      personInCharge: undefined,
      placeOfBirth: undefined,
      postalCode: undefined,
      prefix: undefined,
      province: undefined,
      provinceLocation: undefined,
      refId: undefined,
      status: undefined,
      subDistrict: undefined,
      subDistrictLocation: undefined,
      suffix: undefined,
      telephone: {
        areaCode: undefined,
        ext: undefined,
        number: undefined,
      },
      title: undefined,
      village: undefined,
      villageLocation: undefined,
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const isDetailPage = !pathname.includes('add') && !pathname.includes('edit');


  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('add')) return ({ label: 'Add Management', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Management', url: '' });
    return ({ label: 'Detail Management', url: '' });
  }, []);


  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer management detail form page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Management', url: `/maintenance-data/maintenance-debtor/${processId.includes('DEBT') ? 'master' : 'maintenance'}/${processId}/management-shareholder/management/` },
      pageBreadCrumb
    ]);
  }, []);

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Management', type: 'error' }),
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(data),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save maintenance customer',
      });
      showNiceModalV2({ onClose() {
        router.back();
      }, title: 'Berhasil Menambahkan Management', type: 'success' });
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer',
      });
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({
        onClose: () => {
          router.back();
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          const bucketAction = radioValue === 1 ? 'CANCEL' : 'REJECT';
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          submitBucket({
            submitRequestDto: {
              action: bucketAction,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: '1' },
          { label: 'Rejected', value: '2' }
        ],
      });
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  // Optimize the useEffect for data loading
  useEffect(() => {
    if (data) {
      // Helper function to convert URLs to document objects
      const convertUrlToDocumentObject = (
        payload: { documentExtension: string; document: string; documentName: string }) => {
        if (!payload?.document) return undefined;
        const url = payload.document;
        const name = payload.documentName;
        const extension = `.${payload.documentExtension}`;

        return {
          extension,
          name,
          url,
        };
      };

      // Process telephone format - parse the serialized format
      let telephoneObj = {
        areaCode: undefined,
        ext: undefined,
        number: undefined,
      };

      if (data.telephone) {
        // Parse the serialized format: "areaCode-ext-number"
        const telephoneParts = data.telephone.split('-');
        if (telephoneParts.length === 3) {
          telephoneObj.areaCode = telephoneParts[0] || undefined;
          telephoneObj.ext = telephoneParts[1] || undefined;
          telephoneObj.number = telephoneParts[2] || undefined;
        } else if (telephoneParts.length === 2) {
          // Handle case where there's no extension: "areaCode-number"
          telephoneObj.areaCode = telephoneParts[0] || undefined;
          telephoneObj.number = telephoneParts[1] || undefined;
        } else {
          // Fallback: treat as just the number
          telephoneObj.number = data.telephone;
        }
      }

      // Create a properly structured form data object with all fields
      // Ensure all fields match the schema types
      const formData = {
        ...data,

        address: data.address ? data.address : undefined,

        country: countryDropdownList?.find((item) => item.value === data.country) || undefined,

        district: data.district,

        ktpFile: convertUrlToDocumentObject(data.idDocument),

        nationality: nationalityDropDownList?.find((item) => item.value === data.nationality) || undefined,

        npwpFile: convertUrlToDocumentObject(data.npwpDocument),

        personInCharge: data.personInCharge ? 'true' : data.personInCharge === false ? 'false' : null,
        // City is handled separately since it might not exist in the DTO
        placeOfBirth: data.placeOfBirth ? data.placeOfBirth : undefined,
        postalCode: data.postalCode ? String(data.postalCode) : undefined, // Ensure postalCode is string
        province: data.province,
        refId: data.managementCode || data.refId,
        subDistrict: data.subDistrict,
        telephone: telephoneObj, // Use managementCode if available, otherwise refId
      };

      // Set all form values at once
      reset(formData);
    }
  }, [data, reset]);

  // Now let's fix the dropdown cascade with better dependency tracking
  const config = { staleTime: ONE_MINUTE };
  const options = { label: 'value1', module: 'value2', value: 'key' };

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

  // Status dropdown
  const { data: statusDropdownList } = useGetParameterList('operationStatus', options, config);
  // Title dropdown
  const { data: titleDropdownList } = useGetParameterList('title', options, config);
  // Gender dropdown
  const { data: genderDropdownList } = useGetParameterList('gender', options, config);
  // Job Position dropdown
  const { data: positionDropdownList } = useGetParameterList('jobPosition', options, config);
  // Ethnic Origin dropdown
  const { data: ethnicOriginDropdownList } = useGetParameterList('ethnicOrigin', options, config);
  // ID Type dropdown
  const { data: idTypeDropdownList } = useGetParameterList('idDocType', options, config);
  //nationality dropdown
  const { data: nationalityDropDownList } = useGetParameterList('nationality', options, config);

  // Base country dropdown
  const { data: countryDropdownList } = useGetParameterList('country', options, config);

  // Province dropdown
  const { data: provinceDropdownList } = useGetParameterList('province', options, config);

  // Store module values in state to ensure proper dependency tracking
  const [cityModule, setCityModule] = useState(null);
  const [districtModule, setDistrictModule] = useState(null);
  const [subDistrictModule, setSubDistrictModule] = useState(null);


  // Track province value changes with useEffect
  useEffect(() => {
    const province = watch('province');
    let provinceValue;

    // Handle both object form (from Autocomplete) and string form
    if (typeof province === 'object' && province !== null && 'value' in province) {
      provinceValue = province.value;
    } else {
      provinceValue = province;
    }

    const provinceItem = provinceDropdownList?.find((item) => item.value === provinceValue);
    if (provinceItem?.module) {
      setCityModule(provinceItem.module);
    }
  }, [watch('province'), provinceDropdownList]);

  // City dropdown with proper dependencies
  const { data: cityDropdownList } = useGetParameterList(cityModule, options, {
    ...config,
    enabled: !!cityModule,
  });

  // Track city value changes
  useEffect(() => {
    const city = watch('district');
    let cityValue;

    // Handle both object form (from Autocomplete) and string form
    if (typeof city === 'object' && city !== null && 'value' in city) {
      cityValue = city.value;
    } else {
      cityValue = city;
    }

    const cityItem = cityDropdownList?.find((item) => item.value === cityValue);
    if (cityItem?.module) {
      setDistrictModule(cityItem.module);
    }
  }, [watch('district'), cityDropdownList]);

  // District dropdown with proper dependencies
  const { data: districtDropdownList } = useGetParameterList(districtModule, options, {
    ...config,
    enabled: !!districtModule,
  });

  // Track district value changes
  useEffect(() => {
    const district = watch('subDistrict');
    let districtValue;

    // Handle both object form (from Autocomplete) and string form
    if (typeof district === 'object' && district !== null && 'value' in district) {
      districtValue = district.value;
    } else {
      districtValue = district;
    }

    const districtItem = districtDropdownList?.find((item) => item.value === districtValue);
    if (districtItem?.module) {
      setSubDistrictModule(districtItem.module);
    }
  }, [watch('subDistrict'), districtDropdownList]);

  // SubDistrict dropdown with proper dependencies
  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, options, {
    ...config,
    enabled: !!subDistrictModule,
  });

  // Update postal code when subDistrict changes
  useEffect(() => {
    const subDistrict = watch('village');
    let subDistrictValue;

    // Handle both object form (from Autocomplete) and string form
    if (typeof subDistrict === 'object' && subDistrict !== null && 'value' in subDistrict) {
      subDistrictValue = subDistrict.value;
    } else {
      subDistrictValue = subDistrict;
    }

    const subDistrictItem = subDistrictDropdownList?.find((item) => item.value === subDistrictValue);
    if (subDistrictItem?.module) {
      setValue('postalCode', String(subDistrictItem.module));
    }
  }, [watch('village'), subDistrictDropdownList, setValue]);

  const handleSave = () => {
    // If formValues is not provided (direct call), get values from form
    const values = getValues();

    // Helper function to safely extract value from object if it has a value property
    const getValueFromField = (field) => {
      if (typeof field === 'object' && field !== null && 'value' in field) {
        return field.value;
      }
      return field;
    };

    // Helper function to safely extract file from object if it has a file property
    const getFileFromField = (field) => {
      if (typeof field === 'object' && field !== null && 'file' in field) {
        return field.file;
      }
      return undefined;
    };

    mutate({
      address: values.address,
      bucketProcessId: processId,
      country: getValueFromField(values.country),
      debtorId,
      district: getValueFromField(values.districtLocation) || getValueFromField(values.district),
      dob: values.dob ? new Date(values.dob).toISOString() : undefined,
      ethnicOrigin: values.ethnicOrigin,
      gender: values.gender,
      idDocUrl: getFileFromField(values.ktpFile),
      idNo: values.idNo,
      idType: values.idType,
      identityExpiry: values.identityExpiry ? dayJsJakartaIsoString(values.identityExpiry) : undefined,
      jobPosition: values.jobPosition,
      managementCode: values.managementCode || values.refId,
      module: TypeModule.MAINTENANCE_DATA,
      name: values.name,
      nationality: getValueFromField(values.nationality),
      npwp: values.npwp,
      npwpDocUrl: getFileFromField(values.npwpFile),
      personInCharge: values.personInCharge,
      placeOfBirth: values.placeOfBirth,
      postalCode: values.postalCode ? String(values.postalCode) : undefined,
      prefix: values.prefix,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      province: getValueFromField(values.provinceLocation) || getValueFromField(values.province),
      status: values.status,
      subDistrict: getValueFromField(values.subDistrictLocation) || getValueFromField(values.subDistrict),
      suffix: values.suffix,
      telephone: serializePhoneFields(values.telephone),
      title: values.title,
      village: getValueFromField(values.villageLocation) || getValueFromField(values.village),
    });
  };


  const handleNotComplete = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        closeNiceModal(MODAL.GLOBAL.WARNING);
        handleSave();
      },
      submitText: 'Ya',
      title: 'Data belum lengkap, apakah anda ingin menyimpan data ini?',
      type: 'warning',
    });
  };


  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; value: string}[]) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => item?.value === findPrevValues)?.label;
        } else {
          if (inputKey === 'dob' || inputKey === 'identityExpiry') {
            previousValue = formatDateTime(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }

    return previousValue;
  };

  const otherCountry = useMemo(() => {
    if (!!watch('country') && countryDropdownList?.length) {
      const isOtherCountry = getValues('country')?.value !== 'ID';
      return isOtherCountry;
    }
    return false;
  }, [watch('country'), countryDropdownList]);

  // Add useEffect to handle country changes and auto-fill location fields
  useEffect(() => {
    if (otherCountry) {
      const selectedCountry = countryDropdownList?.find((item) => item.value === getValues('country')?.value);
      setValue('province', otherCountry ? { label: selectedCountry?.label, value: selectedCountry?.value } : null);
      setValue('district', otherCountry ? { label: selectedCountry?.label, value: selectedCountry?.value } : null);
      setValue('subDistrict', otherCountry ? { label: selectedCountry?.label, value: selectedCountry?.value } : null);
      setValue('village', otherCountry ? { label: selectedCountry?.label, value: selectedCountry?.value } : null);
      setValue('postalCode', otherCountry ? '00000' : '');
    }
  }, [watch('country'), otherCountry, countryDropdownList, setValue]);

  const handleBackToListPage = () => {
    router.back();
  };

  return {
    cityDropdownList,
    control,
    countryDropdownList,
    districtDropdownList,
    errors,
    ethnicOriginDropdownList,
    findDataMaster,
    formatString,
    genderDropdownList,
    handleBackToListPage,
    handleNotComplete,
    handleOpenSubmitModal,
    handleSave,
    handleSubmit,
    idTypeDropdownList,
    isDetailPage,
    isSaveLoading,
    isSubmitLoading,
    nationalityDropDownList,
    otherCountry,
    positionDropdownList,
    provinceDropdownList,
    router,
    setValue,
    statusDropdownList,
    subDistrictDropdownList,
    titleDropdownList,
    watch,
  };
};

export default useManagementDetailForm;
