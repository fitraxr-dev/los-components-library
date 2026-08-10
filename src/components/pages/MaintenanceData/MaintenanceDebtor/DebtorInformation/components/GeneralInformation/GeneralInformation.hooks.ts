import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';


const useGeneralInformation = () => {

  const { setValue, watch, control } = useFormContext();

  const options = { label: 'value1', module: 'value2', value: 'key' };
  const { data: institutionTypeList } = useGetParameterList('institutionType');
  const { data: dataSourceDropdownList } = useGetParameterList('datasource');
  const { data: sectorDropdownList } = useGetParameterList('sector', options);

  const { data: provinceDropdownList } = useGetParameterList('province', options);

  const cityModule = provinceDropdownList?.find((item) => item.value === watch('generalInformation.province'))?.module;
  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  });

  const districtModule = cityDropdownList?.find((item) => item.value === watch('generalInformation.district'))?.module;
  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  });

  const subDistrictModule = districtDropdownList?.find((item) => item.value === watch('generalInformation.district'))?.module;
  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  });

  const postalCodeModule = useMemo(() => {
    const postCodeData = subDistrictDropdownList?.find((item) => item.value === watch('generalInformation.locationSubDistrict'))?.module;
    setValue('generalInformation.postalCode', postCodeData);
    return postCodeData;
  }, [subDistrictDropdownList, watch('generalInformation.locationSubDistrict')]);

  return {
    cityDropdownList,
    control,
    dataSourceDropdownList,
    districtDropdownList,
    institutionTypeList,
    postalCodeModule,
    provinceDropdownList,
    sectorDropdownList,
    subDistrictDropdownList,
  };
};

export default useGeneralInformation;
