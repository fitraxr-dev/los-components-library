import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';


const ClientRepresentativeTable = ({ index, isDisabled, key, handleDeleteItem }: any) => {

  const { control, watch, formState: { errors } } = useFormContext();

  const {
    data: roleList,
  } = useGetParameterList('jobPosition', { id: 'key', label: 'value1' });

  return (
    <RowWrapper
      key={key}
      sx={{
        alignclientRepresentative: 'start',
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Controller
          name={`clientRepresentative.${index}.name`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              isMandatory={!isDisabled}
              disabled={isDisabled}
              type="text"
              label="Nama"
              placeholder="Nama"
              containerSx={{ flex: 1 }}
              error={!!errors.clientRepresentative?.[index]?.name}
              helperText={errors.clientRepresentative?.[index]?.name?.message || null}
              onChange={(e) => field.onChange(e)}
            />
          )}
        />
      </Box>

      {/* Position Field (Autocomplete) using Controller */}
      <Box sx={{ flex: 1 }}>
        <Controller
          name={`clientRepresentative.${index}.position`}
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              isMandatory={!isDisabled}
              disabled={isDisabled}
              dropdownList={roleList}
              label="Jabatan"
              placeholder="Jabatan"
              error={!!errors.clientRepresentative?.[index]?.position}
              helperText={errors.clientRepresentative?.[index]?.position?.id.message || null}
              onChange={(e) => field.onChange(e)}
            />
          )}
        />
      </Box>
      <ColumnWrapper sx={{ height: '100%', justifyContent: 'end' }}>
        {watch('clientRepresentative')?.length > 1 ?
          <IconButton
            sx={{ height: '64.4%' }}
            iconName="delete"
            isDisabled={isDisabled}
            onClick={() => handleDeleteItem(index)}
          /> : null}
        {!!errors.clientRepresentative?.[index]?.division || !!errors.clientRepresentative?.[index]?.person ? <Box sx={{ height: '18%' }} /> : null}
      </ColumnWrapper>
    </RowWrapper>
  );
};

export default ClientRepresentativeTable;
