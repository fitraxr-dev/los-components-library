import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Switch from '@/components/shared/Switch';
import TextStyle from '@/components/shared/TextStyle';

import useReassignToForm from './ReassignToForm.hook';

import type { ReassignToFormProps } from './ReassignToForm.types';


const ReassignToForm = (props: ReassignToFormProps) => {
  const { picData, picList, useFormValues, isRiviewAssign = false, isMonitoring = false } = props;
  const theme = useTheme();
  const { control, watch } = useFormValues;

  const {
    userList,
    setUserKeyword,
    setIsPermanent,
    isPermanent,
  } = useReassignToForm(props);

  const today = formatDate(new Date(), 'DD MMMM YYYY');

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Box
        sx={{
          display: 'grid',
          gap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          control={control}
          name={`picList.${picData.index}.selectedUser`}
          render={({ field: { ref, ...field } }) => (
            <Autocomplete
              {...field}
              label="Nama"
              placeholder="Choose Nama"
              isMandatory
              dropdownList={userList}
              onInputChange={setUserKeyword}
            />
          )}
        />
        <Input
          label="Jabatan"
          placeholder="Choose Jabatan"
          containerSx={{ flex: 1 }}
          value={picList[picData.index].reAssignTo.jobPosition}
          disabled
        />
        <Input
          label="Direktorat"
          placeholder="Choose Direktorat"
          value={picList[picData.index].reAssignTo.directorate}
          disabled
        />
        <Input
          label="Divisi"
          placeholder="Choose Divisi"
          value={picList[picData.index].reAssignTo.division}
          disabled
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: theme.spacing(3),
          gridTemplateColumns: isRiviewAssign ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
        }}
      >
        <Box gap={theme.spacing(3)} >
          <TextStyle variant="body3" weight={600}>Re-assign duration</TextStyle>
          {!isRiviewAssign && <Switch
            label="Permanent"
            checked={isPermanent}
            onChange={() => setIsPermanent(!isPermanent)}
          />}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            name={`picList.${picData.index}.reAssignTo.startDate`}
            render={({ field: { ref, value, ...field } }) => (
              <Input
                {...field}
                inputRef={ref}
                label={isRiviewAssign ? 'Date' : 'Duration'}
                type="date"
                containerSx={{ flex: 1 }}
                placeholder="Start Date"
                InputProps={{
                  placeholder: 'Start Date',
                }}
                format="DD MMM YYYY"
                disabled={isPermanent}
                value={isPermanent ? formatDate(new Date(), 'YYYY-MM-DD') : value}
                minDate={today}
                isMandatory={!isPermanent}
                error={isPermanent ? false : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name={`picList.${picData.index}.reAssignTo.endDate`}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                inputRef={ref}
                label={isRiviewAssign ? 'Temporary' : '\u00A0'}
                type="date"
                containerSx={{ flex: 1 }}
                placeholder="End Date"
                InputProps={{
                  placeholder: 'End Date',
                }}
                format="DD MMM YYYY"
                minDate={watch(`picList.${picData.index}.reAssignTo.startDate`)}
                disabled={
                  isPermanent
                  || !watch(`picList.${picData.index}.reAssignTo.startDate`)
                }
              />
            )}
          />
        </Box>

        {
          isRiviewAssign &&
          <Box>
            <Switch
              label="Permanent"
              checked={isPermanent}
              onChange={() => setIsPermanent(!isPermanent)}
            />
          </Box>
        }
      </Box >
    </ColumnWrapper >
  );
};

export default ReassignToForm;
