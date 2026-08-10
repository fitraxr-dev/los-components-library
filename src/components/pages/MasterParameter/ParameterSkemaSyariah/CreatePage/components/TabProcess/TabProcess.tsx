import React, { useState, useMemo } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useMasterParameterTabs } from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import InputList from '@/components/shared/InputList';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { TAB } from '../../../CommonComponent/TabMenu.constant';

import useTabProcessSyariah from './TabProcess.hook';

// Form data type
interface FormData {
  active: boolean;
  productName: string;
  reference: string;
}

const MASTER_PRODUCT_CODES = [
  'AL_MUSYARAKAH',
  'AL_MUSYARAKAH_MUTANAQISAH_MMQ',
  'AL_MURABAHAH',
  'AL_ISTISHNA',
  'AL_QARDH',
  'AL_IJARAH',
  'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ',
  'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT',
  'AL_MUDHARABAH',
];

const TabProcess = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { setActiveTab } = useMasterParameterTabs();
  const theme = useTheme();

  const handleSaveSuccess = React.useCallback(() => {
    setActiveTab(TAB.SUMMARY);
  }, [setActiveTab]);

  // Form field configuration state - initialized as empty, will be populated from API
  const [formFieldConfigs, setFormFieldConfigs] = useState<Array<{
    id: number;
    label: string;
    type: string;
  }>>([]);

  // Set form default values based on API data
  const formDefaultValues = useMemo<FormData>(() => ({
    active: true,
    productName: '',
    reference: '',
  }), []);

  const { control, handleSubmit, watch, setValue, getValues, formState: { isValid } } = useForm<FormData>({
    defaultValues: formDefaultValues,
    mode: 'onChange',
  });

  // Watch form values untuk autosave
  const watchedValues = watch();

  // Track if reference was manually changed by user
  const [referenceChangedByUser, setReferenceChangedByUser] = React.useState(false);

  const {
    formFieldConfigsFromApi,
    handleReferenceChange,
    handleSave,
    isAutoSaveFetching,
    isLoading,
    isStorePending,
    parameterSyariahDetail,
    referensiOptions,
    parameterSyariahOptions,
    selectedReferenceId,
    isViewOnly,
  } = useTabProcessSyariah(
    handleSaveSuccess,
    formFieldConfigs,
    watchedValues
  );

  const isReferenceDisabled = React.useMemo(() => {
    if (isViewOnly) return true;
    if (!watchedValues.productName) return false;
    return MASTER_PRODUCT_CODES.includes(watchedValues.productName);
  }, [isViewOnly, watchedValues.productName]);

  // Update form values when API data changes
  React.useEffect(() => {
    if (parameterSyariahDetail) {
      setValue('active', parameterSyariahDetail.isActive, { shouldValidate: true });
      // Only set productName if it's currently empty
      const currentProductName = getValues('productName');
      if (!currentProductName || currentProductName.trim() === '') {
        setValue('productName', parameterSyariahDetail.productCode || '', { shouldValidate: true });
      }
      // Only set reference if it hasn't been manually changed by user
      if (!referenceChangedByUser) {
        setValue('reference', parameterSyariahDetail.productCodeReference || '', { shouldValidate: true });
      }
    }
  }, [parameterSyariahDetail, setValue, getValues, referenceChangedByUser]);

  // Wrapper function to add formFieldConfigs to the save handler
  const onSaveClick = (formData: FormData) => {
    handleSave({
      ...formData,
      formFieldConfigs,
    });
  };

  const selectedReference = watch('reference');

  // Update formFieldConfigs when API data is available
  React.useEffect(() => {
    if (formFieldConfigsFromApi && formFieldConfigsFromApi.length > 0) {
      setFormFieldConfigs(formFieldConfigsFromApi);
    } else {
      // Clear form field configs when no API data
      setFormFieldConfigs([]);
    }
  }, [formFieldConfigsFromApi]);

  // Function to update form field configuration
  const updateFormFieldConfig = (id: number, field: 'label', value: string) => {
    setFormFieldConfigs((prev) => prev.map((config) =>
      config.id === id ? { ...config, [field]: value } : config
    ));
  };

  // Generate preview form fields based on current configuration
  const previewFormFields = useMemo(() =>
    formFieldConfigs.map((config) => {
      const typeMapping: Record<string, string> = {
        'Currency Input': 'currency',
        'Dropdown': 'dropdown',
        'Percentage Input': 'number',
        'Text Input': 'text',
      };

      return {
        containerSx: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-disabled': {
              backgroundColor: '#FFFFFF',
              borderColor: '#D0D0D0',
              color: '#666666',
            },
            '&:hover': {
              borderColor: '#D0D0D0',
            },
            backgroundColor: '#FFFFFF',
            borderColor: '#D0D0D0',
          },
          flex: 1,
        },
        disabled: true,
        label: `${config.label} *`,
        onChange: () => { },
        placeholder: config.label,
        type: typeMapping[config.type] as 'text' | 'currency' | 'number' | 'dropdown',
        value: '',
      };
    }), [formFieldConfigs]
  );

  return (
    <ColumnWrapper gap={2}>
      <Title title="Process" />
      <SectionTitle title="Produk Syariah" isOpen sx={{ mb: 1 }}></SectionTitle>
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <RowWrapper gap={2} sx={{ mb: 2 }}>
          <Controller
            name="productName"
            control={control}
            rules={{ required: 'Nama Produk is required' }}
            render={({ field, fieldState: { error } }) =>
              <Input
                {...field}
                label="Nama Produk"
                placeholder="Masukkan Nama Produk"
                type="dropdown"
                disabled
                containerSx={{ flex: 1 }}
                dropdownList={parameterSyariahOptions}
                isMandatory
                error={!!error}
                helperText={error?.message}
              />
            }
          />

          <Controller
            name="reference"
            control={control}
            rules={{ required: 'Referensi is required' }}
            render={({ field, fieldState: { error } }) =>
              <Input
                {...field}
                label="Referensi"
                placeholder="Pilih Referensi"
                type="dropdown"
                disabled={isReferenceDisabled || isViewOnly}
                containerSx={{ flex: 1 }}
                dropdownList={referensiOptions}
                isMandatory
                error={!!error}
                helperText={error?.message}
                onChange={(value) => {
                  field.onChange(value);
                  setReferenceChangedByUser(true);
                  handleReferenceChange(value);
                  // Trigger validation after reference change
                  setTimeout(() => {
                    setValue('productName', getValues('productName'), { shouldValidate: true });
                  }, 0);
                }}
              />
            }
          />
        </RowWrapper>

        <RowWrapper gap={2} sx={{ mb: 2 }}>
          <Controller
            name="active"
            control={control}
            render={({ field }) =>
              <Input
                type="radio"
                label="Active"
                value={field.value}
                onChange={field.onChange}
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                containerSx={{ flex: 1 }}
                disabled={isViewOnly}
              />}
          />
        </RowWrapper>

        {/* Form Field Section */}
        <TextStyle
          variant="title1"
          weight={600}
          color={theme.palette.primary.main}
          py={1}
          mt={2}
        >
          Form Field
        </TextStyle>

        {/* Form Rows */}
        <ColumnWrapper gap={2} sx={{ p: 2 }}>
          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <TextStyle variant="body2" color={theme.palette.text.secondary}>
                {selectedReferenceId ? 'Loading form fields...' : 'Loading...'}
              </TextStyle>
            </div>
          ) : formFieldConfigs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <EmptyPlaceholder status="data" imageOnly />
              <TextStyle variant="body2" weight={400} color={theme.palette.text.secondary} sx={{ mt: 2 }}>
                Mohon Pilih Referensi Terlebih Dahulu
              </TextStyle>
            </div>
          ) : (
            formFieldConfigs.map((config, index) => (
              <RowWrapper key={config.id} gap={2} alignItems="center" mt={1} mb={1}>
                {/* Number */}
                <TextStyle
                  variant="body1"
                  weight={400}
                  fontSize="12px"
                  sx={{ flex: '0 0 40px', textAlign: 'center' }}
                >
                  {index + 1}.
                </TextStyle>

                {/* Label Input */}
                <Input
                  label="Field Name"
                  value={config.label}
                  onChange={(value) => updateFormFieldConfig(config.id, 'label', value)}
                  placeholder="Masukkan Field Name"
                  type="text"
                  disabled={isViewOnly}
                  containerSx={{ flex: 1 }}
                />

                {/* Type Input */}
                <Input
                  label="Type"
                  value={config.type}
                  disabled
                  type="text"
                  containerSx={{ flex: 1 }}
                />
              </RowWrapper>
            ))
          )}
        </ColumnWrapper>

        {/* Preview Form Section */}
        <TextStyle
          variant="title1"
          weight={600}
          color={theme.palette.primary.main}
          py={1}
          mt={4}
        >
          Preview Form
        </TextStyle>

        <BaseContainer
          sx={{
            backgroundColor: '#FAFAFA',
            border: '1px solid #E0E0E0',
            boxShadow: 7,
            p: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <TextStyle variant="body2" color={theme.palette.text.secondary}>
                {selectedReferenceId ? 'Loading preview...' : 'Loading...'}
              </TextStyle>
            </div>
          ) : formFieldConfigs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <EmptyPlaceholder status="data" imageOnly />
              <TextStyle variant="body2" weight={400} color={theme.palette.text.secondary} sx={{ mt: 2 }}>
                Mohon Pilih Referensi Terlebih Dahulu
              </TextStyle>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <InputList
                column={2}
                fieldList={previewFormFields}
              />
            </div>
          )}
        </BaseContainer>
      </BaseContainer>

      {!isViewOnly && (
        <RowWrapper marginTop={5} justifyContent="end" gap={theme.spacing(2)}>
          <Button
            variant="outlined"
            onClick={() => { router.back(); }}
            disabled={isStorePending}
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit(onSaveClick)}
            disabled={!isValid || isStorePending || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        </RowWrapper>
      )}

      {isViewOnly && (
        <RowWrapper marginTop={5} justifyContent="end" gap={theme.spacing(2)}>
          <Button variant="outlined" onClick={() => { router.back(); }}>
            Close
          </Button>
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default TabProcess;
