import React from 'react';

import { Box, Checkbox, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import usePICCollapsible from './PICCollapsible.hook';

import type { PICCollapsibleProps } from './PICCollapsible.types';


const PICCollapsible = ({ index, onDelete, totalPIC, divisionId, position }: PICCollapsibleProps) => {
  const theme = useTheme();

  const { control, watch, getValues } = useFormContext();

  const {
    handleDisabledLeaderPIC,
    userList,
    setUserKeyword,
    handleCheckLeader,
  } = usePICCollapsible({ divisionId, index, position });

  return (
    <SectionTitle title={`PIC ${index + 1}`} isOpen={totalPIC === 1}>
      <Box
        sx={{
          display: 'grid',
          gap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          mb: theme.spacing(3),
          mt: theme.spacing(3),
        }}
      >
        <Controller
          control={control}
          name={`pic.${index}`}
          render={({ field: { ref, value, ...field } }) => (
            <Autocomplete
              {...field}
              label="Nama"
              placeholder="Choose Nama"
              value={value}
              dropdownList={userList}
              onInputChange={setUserKeyword}
            />
          )}
        />
        <Input
          value={getValues(`pic.${index}.jobPosition`)}
          label="Jabatan"
          placeholder="Jabatan"
          disabled
        />
        <Input
          value={getValues(`pic.${index}.directorate`)}
          label="Direktorat"
          placeholder="Choose Direktorat"
          disabled
        />
        <Input
          value={getValues(`pic.${index}.division`)}
          label="Divisi"
          placeholder="Choose Divisi"
          disabled
        />
      </Box>

      {totalPIC !== 1 && (
        <RowWrapper alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: theme.spacing(1),
            }}
          >
            <Checkbox
              color="primary"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
                padding: 0,
              }}
              disabled={(handleDisabledLeaderPIC(index))}
              checked={watch(`pic.${index}.isLeaderPIC`)}
              onChange={(e) => handleCheckLeader(e.target.checked)}
            />
            <TextStyle
              variant="body2"
              weight={600}
              color={(handleDisabledLeaderPIC(index)) ? theme.palette.disabled.main : theme.palette.primary.main}
            >
              Leader PIC
            </TextStyle>
          </Box>
          <Button
            startIcon="delete"
            variant="text"
            textWeight={500}
            color="error"
            onClick={() => onDelete(index)}
          >
            Delete PIC
          </Button>
        </RowWrapper>
      )}

    </SectionTitle>
  );
};

export default PICCollapsible;
