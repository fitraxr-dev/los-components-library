import { useState, useMemo, useEffect } from 'react';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import ColumnWrapper from '@/components/shared/ColumnWrapper';

import InputAutocompleteV2 from '../InputAutocompleteV2';

import type { InputAreaProyekProps } from './InputAreaproyek.types';


const InputAreaProyek = ({
  city,
  district,
  province,
  onChange,
}: InputAreaProyekProps) => {

  const [filter, setFilter] = useState<any>({
    city: city,
    district: district,
    province: province,
  });

  // Province List
  const { data: provinceOptions, isLoading: isLoadingProvince } = useGetParameterList('province', { label: 'value1', value: 'key', value2: 'value2' });
  const [provinceOptionsMapped, setProvinceOptionsMapped] = useState([]);

  const selectedProvinceId = useMemo(() => {
    const val = filter?.province?.value;
    if (!val || typeof val !== 'string') return null;

    const province = provinceOptions.find((item) => item.value === val);
    return province?.value2 || null;
  }, [filter, provinceOptions]);

  // City List
  const { data: cityOptions = [], isLoading: isLoadingCity } = useGetParameterList(
    selectedProvinceId ?? '',
    { label: 'value1', value: 'key', value2: 'value2' },
  );
  const [cityOptionsMapped, setCityOptionsMapped] = useState([]);

  const selectedCityId = useMemo(() => {
    const val = filter?.city?.value;
    if (!val || typeof val !== 'string') return null;

    const city = cityOptions.find((item) => item.value === val);
    return city?.value2 || null;
  }, [filter, provinceOptions]);

  // District List
  const { data: districtOptions = [], isLoading: isLoadingDistrict } = useGetParameterList(
    selectedCityId ?? '',
    { label: 'value1', value: 'key', value2: 'value2' },
  );
  const [districtOptionsMapped, setDistrictOptionsMapped] = useState([]);

  useEffect(() => {
    const currentFilter = filter ?? {};

    if (!currentFilter.province) {
      if (currentFilter.city || currentFilter.district) {
        setFilter((prev) => {
          const newFilter = { ...prev };
          delete newFilter.city;
          delete newFilter.district;

          return {
            ...newFilter,
          };
        });
      }

      setCityOptionsMapped([]);
      setDistrictOptionsMapped([]);
    }

    else if (!currentFilter.city && currentFilter.district) {
      setFilter((prev) => {
        const newFilter = { ...prev };
        delete newFilter.district;

        return {
          ...newFilter,
        };
      });

      setDistrictOptionsMapped([]);
    }
    onChange(filter);
  }, [filter]);

  useEffect(() => {
    const provinceOptionsTemp = provinceOptions?.map((item) => ({
      label: item.label,
      value: item.value,
    })

    );
    setProvinceOptionsMapped(provinceOptionsTemp);
  }, [provinceOptions]);

  useEffect(() => {
    const cityOptionsTemp = cityOptions?.map((item) => ({
      label: item.label,
      value: item.value,
    })
    );
    setCityOptionsMapped(cityOptionsTemp);
  }, [cityOptions]);

  useEffect(() => {
    const districtOptionsTemp = districtOptions?.map((item) => ({
      label: item.label,
      value: item.value,
    })
    );
    setDistrictOptionsMapped(districtOptionsTemp);
  }, [districtOptions]);

  useEffect(() => {
    setFilter((prev) => ({
      city: city,
      district: district,
      province: province,
    }));
  }, [city, district, province]);

  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <InputAutocompleteV2
        label="Lokasi Proyek (Provinsi)"
        isLoading={isLoadingProvince}
        dropdownList={provinceOptionsMapped}
        onChange={(value) => {
          const isEmpty = value.id === '' && value.label === '';
          setFilter((prev) => {
            const updated = { ...prev };

            if (isEmpty) {
              delete updated.province;
            } else {
              updated.province = value;
            }

            return updated;
          });
        }}
        value={filter?.province}
      />

      <InputAutocompleteV2
        label="Lokasi Proyek (Kota - Kabupaten)"
        isLoading={isLoadingCity}
        dropdownList={cityOptionsMapped}
        onChange={(value) => {
          const isEmpty = value.id === '' && value.label === '';
          setFilter((prev) => {
            const updated = { ...prev };

            if (isEmpty) {
              delete updated.city;
            } else {
              updated.city = value;
            }

            return updated;
          });
        }}
        value={filter?.city}
      />

      <InputAutocompleteV2
        label="Lokasi Proyek (Kecamatan)"
        isLoading={isLoadingDistrict}
        dropdownList={districtOptionsMapped}
        onChange={(value) => {
          const isEmpty = value.id === '' && value.label === '';
          setFilter((prev) => {
            const updated = { ...prev };

            if (isEmpty) {
              delete updated.district;
            } else {
              updated.district = value;
            }

            return updated;
          });
        }}
        value={filter?.district}
      />
    </ColumnWrapper>
  );
};

export default InputAreaProyek;
