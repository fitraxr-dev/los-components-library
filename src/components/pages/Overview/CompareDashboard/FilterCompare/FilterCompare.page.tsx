'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Box, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';

import useFilterCompare from './FilterCompare.hook';
import { validationSchema } from './FilterCompare.schema';


const FilterComparePage = ({ filterValues, onFilterChange }) => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      direktorat: '',
      divisi1: '',
      divisi2: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const watchDirektorat = watch('direktorat');
  const watchDivisi1 = watch('divisi1');
  const watchDivisi2 = watch('divisi2');

  const isSubmitDisabled = !watchDirektorat || !watchDivisi1 || !watchDivisi2;

  const {
    direktoratOptions,
    divisionOptions,
    handleFilterApply,
    handleFilterReset,
  } = useFilterCompare({
    filterValues,
    onFilterChange,
    watchDirektorat,
  });

  const onSubmit = (data) => {
    handleFilterApply(data);
  };

  const onClear = () => {
    reset();
    handleFilterReset();
  };

  return (
    <BaseContainer sx={{ backgroundColor: 'transparent', border: 'none', p: theme.spacing(3) }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} alignItems="flex-end">

          {/* Direktorat */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 1 }}>
              <Text weight={500}>Direktorat</Text>
            </Box>
            <Controller
              name="direktorat"
              control={control}
              render={({ field, fieldState }) => {
                const selectedOption = direktoratOptions.find((o) => o.id === field.value);
                return (
                  <Autocomplete
                    id="input-direktorat"
                    placeholder="Pilih"
                    dropdownList={direktoratOptions}
                    value={selectedOption || null}
                    onChange={(v) => field.onChange(v?.id)}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
          </Grid>

          {/* Divisi 1 */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 1 }}>
              <Text weight={500}>Divisi 1</Text>
            </Box>
            <Controller
              name="divisi1"
              control={control}
              render={({ field }) => {
                const selectedOption = divisionOptions.find((o) => o.id === field.value);
                return (
                  <Autocomplete
                    id="input-divisi1"
                    placeholder="Pilih"
                    dropdownList={divisionOptions}
                    value={selectedOption || null}
                    disabled={!watchDirektorat}
                    onChange={(v) => field.onChange(v?.id)}
                  />
                );
              }}
            />
          </Grid>

          {/* Divisi 2 */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 1 }}>
              <Text weight={500}>Divisi 2</Text>
            </Box>
            <Controller
              name="divisi2"
              control={control}
              render={({ field }) => {
                const selectedOption = divisionOptions.find((o) => o.id === field.value);
                return (
                  <Autocomplete
                    id="input-divisi2"
                    placeholder="Pilih"
                    dropdownList={divisionOptions}
                    value={selectedOption || null}
                    disabled={!watchDirektorat}
                    onChange={(v) => field.onChange(v?.id)}
                  />
                );
              }}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} md={3}>
            <RowWrapper gap={theme.spacing(1)} justifyContent="flex-end">
              <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitDisabled}>
                Bandingkan
              </Button>
              <Button variant="outlined" onClick={onClear}>
                Reset
              </Button>
            </RowWrapper>
          </Grid>

        </Grid>
      </form>
    </BaseContainer>
  );
};

export default FilterComparePage;
