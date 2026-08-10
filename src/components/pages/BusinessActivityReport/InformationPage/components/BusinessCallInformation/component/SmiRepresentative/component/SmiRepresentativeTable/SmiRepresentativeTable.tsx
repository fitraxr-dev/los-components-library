import { useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import type { SmiMemberType } from './SmiRepresentativeTable.constants';


const SmiRepresentativeTable = ({ index, isDisabled, key, handleDeleteItem }: any) => {

  const { control, watch, formState: { errors } } = useFormContext();
  const watchFields = watch();

  const [name, setName] = useState<string>('');
  const [division, setDivision] = useState<string>('');

  const {
    data: userData,
    isLoading: userDataIsLoading,
  } = useSearchAllUser({
    division: watchFields.smiRepresentative[index].division?.id,
    value: name,
  });

  const { data: divisionData, isLoading: divisionDataIsLoading } = useSearchAllDivision({
    value: division,
  });

  const divisionList = useMemo(() => {
    return divisionData?.contents.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [divisionData, divisionDataIsLoading]);

  const userList = useMemo(() => {
    return userData?.contents.map((dt) => {
      return {
        division: dt.division.map((dt) => dt.divisionCode)[0],
        divisionLabel: dt.division.map((dt) => dt.name)[0],
        id: dt.userId,
        label: dt.fullName,
        position: dt.roleRefactor.roleCode,
        positionLabel: dt.roleRefactor.name,
      };
    });
  }, [userData, userDataIsLoading]);

  return (
    <Controller
      name={`smiRepresentative.${index}`}
      control={control}
      render={({ field }) => (
        <RowWrapper
          key={key}
          sx={{
            alignsmiRepresentative: 'start',
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {/* Division Field */}
          <Box sx={{ flex: 2 }}>
            <Autocomplete
              isMandatory={!isDisabled}
              disabled={isDisabled}
              dropdownList={divisionList}
              isLoading={divisionDataIsLoading}
              label="Divisi"
              placeholder="Divisi"
              value={field.value.division}
              onChange={(value: { label: string; value: string }) => {
                if (isDisabled) return;

                if (value.value === '') {
                  field.onChange({
                    division: null,
                    person: null,
                    position: null,
                  });
                } else {
                  field.onChange({
                    ...field.value,
                    division: { id: value.value, label: value.label },
                    person: null,
                  });
                }
              }}
              onInputChange={(e) => setDivision(e)}
              error={!!errors.smiRepresentative?.[index]?.division}
              helperText={
                errors.smiRepresentative?.[index]?.division?.message ||
                errors.smiRepresentative?.[index]?.division?.id?.message ||
                null
              }
            />
          </Box>

          {/* Person Field */}
          <Box sx={{ flex: 2 }}>
            <Autocomplete
              isMandatory={!isDisabled}
              disabled={isDisabled}
              dropdownList={userList}
              label="Nama"
              placeholder="Nama"
              value={field.value.person}
              onChange={(val: SmiMemberType) => {

                if (val.id === '') {
                  field.onChange({
                    division: null,
                    person: null,
                    position: null,
                  });
                } else {
                  field.onChange({
                    division: { id: val.division, label: val.divisionLabel },
                    person: { id: val.id, label: val.label },
                    position: { id: val.position, label: val.positionLabel },
                  });
                }

              }}
              onInputChange={(e) => setName(e)}
              isLoading={userDataIsLoading}
              error={!!errors.smiRepresentative?.[index]?.person}
              helperText={errors.smiRepresentative?.[index]?.person?.message || null}
            />
          </Box>

          {/* Position Field */}
          <Input
            containerSx={{ flex: 1 }}
            disabled
            type="text"
            label="Jabatan"
            placeholder="Jabatan"
            value={field.value.position?.label}
          />

          <ColumnWrapper sx={{ height: '100%', justifyContent: 'end' }}>
            {watch('smiRepresentative').length > 1 ?
              <IconButton
                sx={{ height: '64.4%' }}
                iconName="delete"
                isDisabled={isDisabled}
                onClick={() => handleDeleteItem(index)}
              /> : null}
            {!!errors.smiRepresentative?.[index]?.division || !!errors.smiRepresentative?.[index]?.person ? <Box sx={{ height: '18%' }} /> : null}
          </ColumnWrapper>
        </RowWrapper>
      )}
    />
  );
};

export default SmiRepresentativeTable;
