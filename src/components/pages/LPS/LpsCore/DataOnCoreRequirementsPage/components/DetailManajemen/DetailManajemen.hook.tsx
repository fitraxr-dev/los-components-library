import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetManagement from '../../hooks/useGetManagementById';


const useDetailManajemen = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { id } = useParams();

  const { processId } = useIdentity();

  const isDebtor = processId?.includes('DEBT');

  const methods = useForm({
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
  });

  const { control, reset, watch, setValue } = methods;

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  const { data: detailManagementData, isSuccess: isSuccessManagement } = useGetManagement({
    bucketProcessId: isDebtor ? '' : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    managementCode: String(id),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  const config = { staleTime: ONE_MINUTE };
  const options = { label: 'value1', module: 'value2', value: 'key' };

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

  const handleBackToListPage = () => {
    router.back();
  };

  useEffect(() => {
    if (isSuccessManagement && detailManagementData) {
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

      if (detailManagementData.telephone) {
        // Parse the serialized format: "areaCode-ext-number"
        const telephoneParts = detailManagementData.telephone.split('-');
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
          telephoneObj.number = detailManagementData.telephone;
        }
      }

      // Create a properly structured form detailManagementData object with all fields
      // Ensure all fields match the schema types
      const formData = {
        ...detailManagementData,
        // City is handled separately since it might not exist in the DTO
        address: detailManagementData.address,
        city: detailManagementData.city,
        country: countryDropdownList?.find((item) => item.value === detailManagementData.country) || undefined,
        district: detailManagementData.district,
        districtLocation: detailManagementData.districtLocation,
        dob: detailManagementData.dob,
        ethnicOrigin: detailManagementData.ethnicOrigin,
        gender: detailManagementData.gender,
        idNo: detailManagementData.idNo,
        idType: detailManagementData.idType,
        identityExpiry: detailManagementData.identityExpiry,
        jobPosition: detailManagementData.jobPosition,
        ktpFile: convertUrlToDocumentObject(detailManagementData.idDocument),
        managementCode: detailManagementData.managementCode,
        modifiedBy: detailManagementData.modifiedBy,
        modifiedDate: detailManagementData.modifiedDate,
        name: detailManagementData.name,
        nationality: nationalityDropDownList?.find((item) =>
          item.value === detailManagementData.nationality) || undefined,
        npwp: detailManagementData.npwp,
        npwpFile: convertUrlToDocumentObject(detailManagementData.npwpDocument),
        personInCharge: detailManagementData.personInCharge ? 'true' : detailManagementData.personInCharge === false ? 'false' : null,
        placeOfBirth: detailManagementData.placeOfBirth,
        postalCode: detailManagementData.postalCode ?
          String(detailManagementData.postalCode) : undefined,
        prefix: detailManagementData.prefix,
        province: detailManagementData.province,
        provinceLocation: detailManagementData.provinceLocation,
        refId: detailManagementData.managementCode || detailManagementData.refId,
        status: detailManagementData.status,
        subDistrict: detailManagementData.subDistrict,
        subDistrictLocation: detailManagementData.subDistrictLocation,
        suffix: detailManagementData.suffix,
        telephone: telephoneObj,
        title: detailManagementData.title,
        village: detailManagementData.village,
        villageLocation: detailManagementData.villageLocation,
      };

      // Set all form values at once
      reset(formData);
    }
  }, [detailManagementData, reset]);

  return {
    cityDropdownList,
    control,
    countryDropdownList,
    districtDropdownList,
    ethnicOriginDropdownList,
    genderDropdownList,
    handleBackToListPage,
    idTypeDropdownList,
    nationalityDropDownList,
    positionDropdownList,
    provinceDropdownList,
    setValue,
    statusDropdownList,
    subDistrictDropdownList,
    theme,
    titleDropdownList,
    watch,
  };
};
export default useDetailManajemen;
