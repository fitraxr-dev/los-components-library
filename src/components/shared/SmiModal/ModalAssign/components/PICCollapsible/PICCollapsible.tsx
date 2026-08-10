import { Box, Checkbox, useTheme } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import usePICCollapsible from './PICCollapsible.hook';

import type { PICCollapsibleProps } from './PICCollapsible.types';


const PICCollapsible = ({
  index,
  onDelete,
  totalPIC,
  divisionId,
  position,
  isRiviewAssign = false,
}: PICCollapsibleProps) => {
  const theme = useTheme();
  const { control, getValues, setValue } = useFormContext();

  const {
    handleCheckLeader,
    handleDisabledLeaderPIC,
    setUserKeyword,
    userList,
  } = usePICCollapsible({ divisionId, index, position });

  const isLeaderPIC = useWatch({ control, name: `pic.${index}.isLeaderPIC` });

  const handleLeaderCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(`pic.${index}.isLeaderPIC`, event.target.checked);
  };

  return (
    <SectionTitle title={`PIC ${index + 1}`} isOpen={totalPIC === 1}>
      {totalPIC !== 1 && !isRiviewAssign && (
        <RowWrapper
          sx={{
            alignItems: 'center',
            gap: theme.spacing(3),
            justifyContent: 'end',
            mt: theme.spacing(3),
          }}
        >
          <Button
            variant="outlined"
            textWeight={500}
            color="error"
            onClick={() => onDelete(index)}
          >
            Delete PIC
          </Button>
          <Button
            variant={isLeaderPIC ? 'contained' : 'outlined'}
            textWeight={500}
            color="success"
            disabled={handleDisabledLeaderPIC(index)}
            onClick={() => handleCheckLeader(!isLeaderPIC)}
          >
            {isLeaderPIC ? 'Assigned as Leader' : 'Assign as Leader'}
          </Button>
        </RowWrapper>
      )}

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

      {totalPIC !== 1 && isRiviewAssign && (
        <RowWrapper
          sx={{
            alignItems: 'center',
            gap: theme.spacing(3),
            justifyContent: 'space-between',
            mt: theme.spacing(3),
          }}
        >

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: theme.spacing(1),
            }}
          >
            <Checkbox
              checked={isLeaderPIC}
              onChange={handleLeaderCheckboxChange}
              disabled={handleDisabledLeaderPIC(index)}
              color="primary"
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 'clamp(22px, 1.6vw, 36px)',
                },
                padding: 0,
              }}
            />
            <TextStyle
              variant="body2"
              weight={600}
              color={isLeaderPIC ? theme.palette.primary.main : theme.palette.disabled.main}
            >
              Leader PIC
            </TextStyle>
          </Box>


          <Button
            variant="text"
            textWeight={500}
            color="error"
            onClick={() => onDelete(index)}
            startIcon="delete"
          >
            Delete PIC
          </Button>
        </RowWrapper>
      )
      }
    </SectionTitle >
  );
};

export default PICCollapsible;
