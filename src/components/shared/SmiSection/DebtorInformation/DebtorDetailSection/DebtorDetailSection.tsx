import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import type { CustomFieldError, DebtorDetailSectionProps } from './DebtorDetailSection.types';


const DebtorDetailSection = (props: DebtorDetailSectionProps) => {
  const { control, jobPositionData, setValue, watch, clearErrors, viewOnly } = props;
  const theme = useTheme();

  return (
    <SectionTitle title="Detail Customer" isOpen>
      <BaseContainer
        sx={{
          boxShadow: 2,
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginTop: 2,
          maxWidth: '100%',
          padding: theme.spacing(2),
        }}
      >
        <Controller
          control={control}
          name="debtor.debtorName"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="text"
              label="Nama Customer"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={invalid && error?.message}
              disabled
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.relationshipSince"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              isMandatory={!viewOnly}
              type="text"
              label="Hubungan dengan SMI Sejak Tahun"
              placeholder="contoh: Sejak 2020"
              containerSx={{ flex: 1 }}
              disabled={viewOnly}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.yearFounded"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              isMandatory={!viewOnly}
              type="text"
              label="Tahun Didirikan"
              placeholder="contoh: Sejak 2020"
              containerSx={{ flex: 1 }}
              disabled={viewOnly}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.isAffiliate"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="radio"
              label="Terafiliasi dengan SMI"
              value={watch('debtor.isAffiliate')}
              onChange={(e) => onChange(JSON.parse(e.target.value))}
              radioList={[
                {
                  label: 'Ya',
                  value: true,
                },
                {
                  label: 'Tidak',
                  value: false,
                },
              ]}
              sx={{ flex: 1 }}
              disabled={viewOnly}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.isGroup"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="radio"
              label="Customer Memiliki Group"
              value={watch('debtor.isGroup')}
              onChange={(e) => onChange(JSON.parse(e.target.value))}
              radioList={[
                {
                  label: 'Ya',
                  value: true,
                },
                {
                  label: 'Tidak',
                  value: false,
                },
              ]}
              sx={{ flex: 1 }}
              disabled
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.isRelatedToSmi"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="radio"
              label="Terkait Dengan SMI"
              value={watch('debtor.isRelatedToSmi')}
              onChange={(e) => onChange(JSON.parse(e.target.value))}
              radioList={[
                {
                  label: 'Ya',
                  value: true,
                },
                {
                  label: 'Tidak',
                  value: false,
                },
              ]}
              sx={{ flex: 1 }}
              disabled
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="debtor.debtorType"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="text"
              label="Jenis Customer"
              placeholder="Input Jenis Customer"
              containerSx={{ flex: 1 }}
              disabled
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <div />
        <Controller
          control={control}
          name="debtor.sectorName"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              isMandatory={!viewOnly}
              type="text"
              label="Jenis Sektor Usaha"
              placeholder="Input Jenis Sektor Usaha"
              containerSx={{ flex: 1 }}
              disabled={viewOnly}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            name="debtor.contactPerson"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="text"
                label="Contact Person"
                placeholder="Input Contact Person"
                containerSx={{ flex: 1 }}
                disabled={viewOnly}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="debtor.position"
            render={({ field, fieldState: { error, invalid } }) => {
              const _error: CustomFieldError = error as CustomFieldError;

              return (
                <Autocomplete
                  {...field}
                  label="Jabatan"
                  placeholder="Select Jabatan"
                  dropdownList={jobPositionData}
                  value={watch('debtor.position')}
                  onChange={(val) => {
                    setValue('debtor.position', val);
                    if (invalid) clearErrors('debtor.position');
                  }}
                  error={invalid}
                  helperText={_error?.label?.message}
                  disabled={viewOnly}
                />
              );
            }}
          />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default DebtorDetailSection;
